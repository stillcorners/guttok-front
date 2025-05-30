import { z } from 'zod'

export const emailSchema = z.object({
  email: z
    .string()
    .nonempty('이메일을 입력해 주세요.')
    .email('유효한 이메일 주소를 입력하세요.'),
})

export const nickNameSchema = z
  .string()
  .min(2, '닉네임을 2자 이상 입력해 주세요.')

export const passwordSchema = z
  .string()
  .min(
    12,
    '비밀번호를 특수문자(@&!%*?&#)와 소문자 영어를 포함하여 12자 이상 입력해 주세요.',
  )

export const loginSchema = z.object({
  email: z.string().email('올바른 이메일을 입력해주세요.'),
  password: z.string().min(1, '정확한 비밀번호를 입력해주세요.'),
})

export const registerSchema = z
  .object({
    nickName: z.string().min(2, '닉네임을 2자 이상 입력해 주세요.'),
    email: z
      .string()
      .nonempty('이메일을 입력해 주세요.')
      .email('유효한 이메일 주소를 입력해 주세요.'),
    policyConsent: z.literal(true, {
      errorMap: () => ({
        message: '개인정보 수집 및 이용에 동의해 주세요.',
      }),
    }),
    password: z
      .string()
      .min(
        12,
        '비밀번호를 특수문자(@&!%*?&#)와 소문자 영어를 포함하여 12자 이상 입력해 주세요.',
      )
      .regex(
        /^(?=.*[a-z])(?=.*[@$!%*?&#]).{12,}$/,
        '비밀번호에 특수문자(@$!%*?&#)와 영어 소문자를 포함해주세요.',
      ),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.passwordConfirm.length > 0, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordConfirm'],
  })
