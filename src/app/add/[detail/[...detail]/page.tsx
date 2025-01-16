'use client'

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { KNOWN_SERVICES } from '#constants/knownServices';
import { Label } from '#components/_common/Label';
import { Input } from '#components/_common/Input';
import { Button } from '#components/_common/Button';
import CardTitle from '#components/_common/CardTitle';

export default function Page() {

  const params = useParams();
  const detail = params?.detail || [];
  const serviceId = detail[0] || null;
  //const serviceId = params?.detail?.[0];
  const service = serviceId ? KNOWN_SERVICES.find((s) => s.id === serviceId) : null;

  const isDirectAdd = !serviceId;
  const isCustom = serviceId === 'custom';
  const serviceName = isCustom ? '' : service ? service.name : '';

  return (
    <CardTitle className="flex" content={
      <div className="flex flex-col justify-center items-center my-12">
        <form className="space-y-4 ">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center justify-between">
              <Label className="block mr-8 tracking-wide text-lg font-medium text-nowrap">구독 서비스 *</Label>
              <Input
                type="text"
                value={isDirectAdd ? '' : serviceName} readOnly={!isCustom}
                placeholder="넷플릭스, 통신비, etc"
                className="block max-w-60 min-w-60 pl-2 text-sm sm:text-base"
              />
            </div>
            <div className='flex items-center justify-between'>
              <Label className="block mr-8 tracking-wide text-lg font-medium text-nowrap">결제 금액 *</Label>
              <Input
                type="number"
                placeholder="금액을 입력하세요"
                className="block max-w-60 min-w-60 pl-2 text-sm sm:text-base"
              />
            </div>
            <div className='flex items-center justify-between'>
              <Label className="block mr-8 tracking-wide text-lg font-medium text-nowrap">첫 결제 날짜 *</Label>
              <Input
                type="date"
                className="block pl-2 max-w-60 min-w-60 text-sm sm:text-base"
              />
            </div>
            <div className='flex items-center justify-between'>
              <Label className="block mr-8 tracking-wide text-lg font-medium text-nowrap">결제 수단</Label>
              <Input
                type="text"
                placeholder="결제수단을 입력하세요"
                className="pl-2 max-w-60 min-w-60 text-sm sm:text-base"
              />
            </div>
            <div className='flex justify-end' >
              <Link href="item/add/detail/custom">
                <p className="tracking-wide underline text-base">색깔과 아이콘을 선택해주세요</p>
              </Link>
            </div>
            <div className='flex justify-between'>
              <Label className="mr-8 tracking-wide block text-lg font-medium text-nowrap">메모</Label>
              <textarea
                placeholder="메모를 입력하세요"
                className="p-2 max-w-60 min-w-60 text-sm sm:text-base block rounded-md border border-gray-300 shadow-sm"
                rows={2}
              />
            </div>

            <Button
              type="submit"
              className="w-full py-2 mt-4 text-base text-white shadow"
            >
              저장하기
            </Button>
          </div>
        </form>
      </div>
    }>구독 서비스 세부설정
    </CardTitle>
  );
};

// PUSH 할 때까지 TODO
// [ ] ID 넘겨받기
// [ ] label, placeholder, date icon color 변경