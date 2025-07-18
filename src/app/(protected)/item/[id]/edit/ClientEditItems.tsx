'use client'

import { PATH } from '#app/routes'
import { useRouter } from 'next/navigation'
import { Input } from '#components/_common/Input'
import { Button } from '#components/_common/Button'
import { cn } from '#components/lib/utils'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectGroup,
} from '#components/_common/Select'
import CardTitle from '#components/_common/CardTitle'
import { useServiceStore } from '#stores/subscriptions/useServiceStore'
import { useSubscriptionStore } from '#stores/subscriptions/useSubscriptionStore'
import {
  ServiceId,
  PaymentMethod,
  PaymentCycle,
  paymentStatus,
  SubscriptionContents,
} from '#types/subscription'
import { groupClassName, inputClassName, labelClassName } from '#style/style'
import { useEffect, useMemo } from 'react'
import {
  useUpdateItemsClient,
  useGetDetailClient,
} from '#apis/subscriptionClient'
import { Textarea } from '#components/_common/TextArea'

export default function ClientEditItems({
  params,
}: {
  params: { id: string }
}) {
  const subscriptionId = Number(params?.id ?? NaN)
  const router = useRouter()
  const {
    data: item,
    isLoading,
    error,
  } = useGetDetailClient(String(subscriptionId))

  const patchMutation = useUpdateItemsClient()
  const { selectedService } = useServiceStore()
  const {
    subscriptionData,
    setSubscriptionData,
    updateField,
    paymentMethodOptions,
    paymentCycleOptions,
    paymentDayOptions,
    resetSubscriptionData,
    getDisplayTitle,
  } = useSubscriptionStore()

  const displayTitle = getDisplayTitle()

  const { paymentAmount, paymentCycle, paymentDay, paymentMethod, memo } =
    subscriptionData

  useEffect(() => {
    if (item) {
      setSubscriptionData({
        title: item.title,
        subscription: item.subscription,
        paymentAmount: item.paymentAmount,
        paymentMethod: item.paymentMethod,
        paymentCycle: item.paymentCycle,
        paymentDay: String(item.paymentDay),
        memo: item.memo ?? '',
        paymentStatus: item.paymentStatus,
      })
    }
  }, [item])

  const buildPayload = (): SubscriptionContents => {
    return {
      ...subscriptionData,
      subscription: selectedService?.id as ServiceId,
      id: subscriptionId,
      paymentMethod: subscriptionData.paymentMethod as PaymentMethod,
      paymentCycle: subscriptionData.paymentCycle as PaymentCycle,
      paymentStatus: subscriptionData.paymentStatus as paymentStatus,
    }
  }

  const isFormValid = useMemo(() => {
    const { title, subscription, paymentAmount, paymentCycle, paymentDay } =
      subscriptionData
    const isCustom = subscription === 'CUSTOM_INPUT'
    return !!(
      (isCustom ? title : true) &&
      paymentAmount &&
      paymentCycle &&
      paymentDay
    )
  }, [subscriptionData])

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    patchMutation.mutate(
      {
        id: subscriptionId,
        payload: buildPayload(),
      },
      {
        onSuccess: () => {
          resetSubscriptionData()
          router.push(PATH.itemDetail(subscriptionId))
        },
        onError: (err) => {
          console.error('Error updating subscription:', err)
        },
      },
    )
  }

  if (isNaN(subscriptionId)) {
    return <p className="text-red-500 text-center">잘못된 접근입니다.</p>
  }

  if (isLoading) {
    return <p className="text-center text-gray-400">데이터 불러오는 중...</p>
  }

  if (error) {
    return (
      <p className="text-center text-red-500">
        구독 정보를 불러오지 못했습니다
      </p>
    )
  }

  return (
    <CardTitle>
      <CardTitle.Heading>구독 서비스 수정</CardTitle.Heading>
      <CardTitle.Divider />
      <div className="flex flex-col justify-center items-center my-8 font-medium">
        <form className="grid grid-cols-1 gap-4" onSubmit={handleUpdate}>
          <div className="grid grid-cols-1 flex-col gap-2 sm:gap-4">
            <SelectGroup className={cn(groupClassName)}>
              <SelectLabel
                aria-labelledby="subscriptionTitle"
                aria-describedby="subscriptionTitle-required"
                aria-required="true"
                className={cn(labelClassName)}
              >
                구독 서비스{' '}
                <span
                  id="subscriptionTitle-required"
                  className="font-light text-sm text-[hsl(var(--destructive))]"
                >
                  필수
                </span>
              </SelectLabel>
              <Input
                type="text"
                aria-labelledby="subscriptionTitle"
                aria-describedby="subscriptionTitle-required"
                value={displayTitle}
                onChange={(e) => {
                  if (subscriptionData.subscription === 'CUSTOM_INPUT') {
                    updateField('title', e.target.value)
                  }
                }}
                readOnly={subscriptionData.subscription !== 'CUSTOM_INPUT'}
                placeholder={
                  subscriptionData.subscription === 'CUSTOM_INPUT'
                    ? '구독명을 입력하세요'
                    : displayTitle
                }
                className={cn(inputClassName)}
              />
            </SelectGroup>
            <SelectGroup className={cn(groupClassName)}>
              <SelectLabel
                aria-labelledby="subscriptionAmount"
                aria-describedby="subscriptionAmount-required"
                aria-required="true"
                className={cn(labelClassName)}
              >
                결제 금액
                <span
                  id="subscriptionAmount-required"
                  className="font-light text-sm text-[hsl(var(--destructive))] ml-2"
                >
                  필수
                </span>
              </SelectLabel>
              <Input
                type="number"
                aria-labelledby="subscriptionAmount"
                aria-describedby="subscriptionAmount-required"
                value={paymentAmount}
                onChange={(e) => updateField('paymentAmount', e.target.value)}
                placeholder="금액을 입력하세요"
                className={cn(inputClassName)}
              />
            </SelectGroup>
            <SelectGroup className={cn(groupClassName)}>
              <SelectLabel
                id="paymentCycleLabel"
                aria-labelledby="paymentCycleLabel"
                aria-describedby="paymentCycle-required"
                className={cn(labelClassName)}
              >
                결제 주기
                <span
                  id="subscriptionCycle-required"
                  className="font-light text-sm text-[hsl(var(--destructive))] ml-2"
                >
                  필수
                </span>
              </SelectLabel>
              <div className="flex items-center space-x-2">
                <label
                  id="cyclePrefixLabel"
                  htmlFor="paymentCycle"
                  className="text-sm font-medium"
                >
                  매
                </label>
                <Select
                  onValueChange={(value) => updateField('paymentCycle', value)}
                >
                  <SelectTrigger
                    id="paymentCycle"
                    aria-labelledby="paymentCycleLabel cyclePrefixLabel"
                    aria-describedby="paymentCycle-required"
                    role="combobox"
                    aria-expanded="false"
                    aria-controls="paymentCycle-options"
                    className="flex border rounded-md px-4 sm:w-auto"
                  >
                    {
                      paymentCycleOptions.find(
                        (option) => option.value === paymentCycle,
                      )?.label
                    }
                    <SelectContent
                      id="paymentCycle-options"
                      className="border px-2 py-1 mr-10 rounded-md dark:text-black"
                    >
                      {paymentCycleOptions.map(({ value, label }) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectTrigger>
                </Select>
                <Select
                  onValueChange={(value) => updateField('paymentDay', value)}
                >
                  <SelectTrigger
                    id="paymentDay"
                    aria-labelledby="paymentCycleLabel cycleSuffixLabel"
                    aria-describedby="paymentCycle-required"
                    role="combobox"
                    aria-expanded="false"
                    aria-controls="paymentDay-options"
                    className="flex border rounded-md px-4"
                  >
                    {
                      paymentDayOptions.find(
                        (option) => String(option.value) === paymentDay,
                      )?.label
                    }
                    <SelectContent
                      id="paymentDay"
                      className="border px-2 py-1 mr-10 rounded-md dark:text-black block"
                    >
                      {paymentDayOptions.map(({ value, label }) => (
                        <SelectItem key={value} value={String(value)}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectTrigger>
                </Select>
                <label
                  id="cycleSuffixLabel"
                  htmlFor="paymentDay"
                  className="text-sm font-medium"
                >
                  일
                </label>
              </div>
            </SelectGroup>

            <SelectGroup className={cn(groupClassName)}>
              <SelectLabel
                id="paymentMethodLabel"
                className={cn(labelClassName)}
                aria-labelledby="paymentMethodLabel"
                aria-required="true"
                aria-describedby="paymentMethod-required"
              >
                결제수단
                <span
                  id="subscriptionAmount-required"
                  className="font-light text-sm text-[hsl(var(--destructive))] ml-2"
                >
                  필수
                </span>
              </SelectLabel>
              <Select
                onValueChange={(value) => updateField('paymentMethod', value)}
              >
                <SelectTrigger
                  aria-placeholder="결제수단을 선택하세요"
                  id="paymentMethod"
                  aria-labelledby="paymentMethodLabel"
                  role="combobox"
                  aria-expanded="false"
                  aria-controls="paymentMethod-options"
                  className="w-[12.5rem] sm:max-w-[12.5rem] sm:min-w-[12.5rem] 
                pl-2 flex tracking-wide text-lg font-medium text-nowrap"
                >
                  {
                    paymentMethodOptions.find(
                      (option) => option.value === paymentMethod,
                    )?.label
                  }
                  <SelectContent
                    id="paymentMethod"
                    className="border rounded-md px-2 py-1 dark:text-black block"
                  >
                    {paymentMethodOptions.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectTrigger>
              </Select>
            </SelectGroup>
            <SelectGroup className={cn(groupClassName)}>
              <SelectLabel className={cn(labelClassName)}>메모</SelectLabel>
              <Textarea
                placeholder="메모를 입력하세요"
                maxLength={200}
                onChange={(e) => updateField('memo', e.target.value)}
                value={memo}
                className="p-2 w-[12.5rem] sm:max-w-[12.5rem] sm:min-w-[12.5rem]  text-sm sm:text-base block 
                bg-white text-black dark:bg-[hsl(var(--secondary))] placeholder-[hsl(var(--muted-foreground))]
                dark:text-white dark:border-white rounded-md border border-gray-300 shadow-sm"
                rows={2}
              />
            </SelectGroup>
            <Button
              type="submit"
              disabled={!isFormValid}
              className={`w-full py-2 mt-4 text-base text-white shadow ${
                !isFormValid ? 'bg-gray-400 cursor-not-allowed' : 'primary'
              }`}
            >
              저장하기
            </Button>
          </div>
        </form>
      </div>
    </CardTitle>
  )
}
