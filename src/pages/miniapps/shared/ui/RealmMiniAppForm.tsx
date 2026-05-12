import {
	accessTypeDescriptions,
	accessTypeLabels,
	roleMatchModeDescriptions,
	roleMatchModeLabels,
	type AccessType,
	type RealmMiniApp,
	type RealmMiniAppFormValues,
	type RoleMatchMode,
} from '@/entities/miniapp'
import type { RealmRole } from '@/entities/realm'
import type { RealmMiniAppPermissions } from '@/entities/user'
import { buildRealmRoleCreateRoute } from '@/shared/config'
import { ButtonField } from '@/shared/ui/ButtonField'
import { InputField } from '@/shared/ui/InputField'
import { SelectField } from '@/shared/ui/SelectField'
import { TextAreaField } from '@/shared/ui/TextAreaField'
import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Typography } from 'antd'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import styles from './RealmMiniAppForm.module.css'

const { Text, Title } = Typography

type RealmMiniAppFormMode = 'access' | 'create' | 'edit'

interface RealmMiniAppFormProps {
	existingCodes?: string[]
	initialValues: RealmMiniAppFormValues
	mode: RealmMiniAppFormMode
	onCancel?: () => void
	onFinish: (values: RealmMiniAppFormValues) => void
	permissions: RealmMiniAppPermissions
	realmCode: string
	realmRoles: RealmRole[]
	submitLabel: string
}

const accessTypeOptions: Array<{ label: string; value: AccessType }> = [
	{ label: accessTypeLabels.PUBLIC_IN_REALM, value: 'PUBLIC_IN_REALM' },
	{ label: accessTypeLabels.AUTHENTICATED, value: 'AUTHENTICATED' },
	{ label: accessTypeLabels.ROLE_BASED, value: 'ROLE_BASED' },
]

const roleMatchModeOptions: Array<{ label: string; value: RoleMatchMode }> = [
	{ label: roleMatchModeLabels.ANY, value: 'ANY' },
	{ label: roleMatchModeLabels.ALL, value: 'ALL' },
]

const roleMatchModeHint = `${roleMatchModeDescriptions.ANY} ${roleMatchModeDescriptions.ALL}`

const optionalUrl = z
	.string()
	.trim()
	.optional()
	.refine(value => {
		if (!value) {
			return true
		}

		try {
			new URL(value)
			return true
		} catch {
			return false
		}
	}, 'Введите валидный URL')

const settingsSchema = z
	.string()
	.optional()
	.refine(value => {
		if (!value?.trim()) {
			return true
		}

		try {
			JSON.parse(value)
			return true
		} catch {
			return false
		}
	}, 'Настройки должны быть валидным JSON')

const realmMiniAppFormSchema = z
	.object({
		accessType: z.enum(['PUBLIC_IN_REALM', 'AUTHENTICATED', 'ROLE_BASED'], {
			message: 'Это обязательное поле',
		}),
		backendUrl: optionalUrl,
		code: z.string().optional(),
		description: z.string().optional(),
		entryUrl: z
			.string()
			.trim()
			.min(1, 'Это обязательное поле')
			.refine(value => {
				try {
					new URL(value)
					return true
				} catch {
					return false
				}
			}, 'Введите валидный URL'),
		iconUrl: optionalUrl,
		name: z.string().trim().min(1, 'Это обязательное поле'),
		requiredRoles: z.array(z.string()).optional(),
		roleMatchMode: z.enum(['ANY', 'ALL']).optional(),
		settings: settingsSchema,
	})
	.superRefine((values, context) => {
		if (values.accessType !== 'ROLE_BASED') {
			return
		}

		if (!values.roleMatchMode) {
			context.addIssue({
				code: 'custom',
				message: 'Выберите режим проверки ролей',
				path: ['roleMatchMode'],
			})
		}

		if (!values.requiredRoles || values.requiredRoles.length === 0) {
			context.addIssue({
				code: 'custom',
				message: 'Выберите хотя бы одну Realm Role',
				path: ['requiredRoles'],
			})
		}
	})

export const buildRealmMiniAppFormValues = (
	miniApp: RealmMiniApp,
): RealmMiniAppFormValues => ({
	accessType: miniApp.accessType,
	backendUrl: miniApp.backendUrl ?? '',
	code: miniApp.code,
	description: miniApp.description ?? '',
	entryUrl: miniApp.entryUrl,
	iconUrl: miniApp.iconUrl ?? '',
	name: miniApp.name,
	requiredRoles: miniApp.requiredRoles ?? [],
	roleMatchMode: miniApp.roleMatchMode,
	settings: miniApp.settings ? JSON.stringify(miniApp.settings, null, 2) : '',
})

export const RealmMiniAppForm = ({
	existingCodes = [],
	initialValues,
	mode,
	onCancel,
	onFinish,
	permissions,
	realmCode,
	realmRoles,
	submitLabel,
}: RealmMiniAppFormProps) => {
	const {
		control,
		handleSubmit,
		reset,
		setError,
		watch,
		formState: { isDirty, isValid },
	} = useForm<RealmMiniAppFormValues>({
		defaultValues: initialValues,
		mode: 'onChange',
		resolver: zodResolver(realmMiniAppFormSchema),
	})
	const accessType = watch('accessType')
	const isRoleBased = accessType === 'ROLE_BASED'
	const isAccessOnly = mode === 'access'
	const canEditCore = mode === 'create' || permissions.canEditMiniApp
	const canEditAccess = mode === 'create' || permissions.canEditAccess
	const roleOptions = realmRoles.map(role => ({
		label: role.code,
		title: role.name,
		value: role.code,
	}))

	useEffect(() => {
		reset(initialValues)
	}, [initialValues, reset])

	const handleSave = (values: RealmMiniAppFormValues) => {
		const code = values.code?.trim() ?? ''

		if (mode === 'create' && !code) {
			setError('code', {
				message: 'Это обязательное поле',
				type: 'manual',
			})
			return
		}

		if (mode === 'create' && !/^[a-z0-9-]+$/.test(code)) {
			setError('code', {
				message:
					'Код может содержать только строчные латинские буквы, цифры и дефис',
				type: 'manual',
			})
			return
		}

		if (mode === 'create' && existingCodes.includes(code)) {
			setError('code', {
				message: 'MiniApp с таким кодом уже существует',
				type: 'manual',
			})
			return
		}

		onFinish(values)
	}

	return (
		<form className={styles.form} onSubmit={handleSubmit(handleSave)}>
			{!isAccessOnly && (
				<section className={styles.section}>
					<div className={styles.sectionHeader}>
						<Title className={styles.sectionTitle} level={3}>
							MiniApp
						</Title>
						<Text type='secondary'>
							Код создаётся внутри Realm и дальше не меняется.
						</Text>
					</div>

					<div className={styles.fieldGrid}>
						<InputField
							control={control}
							disabled={mode !== 'create'}
							label='Код'
							name='code'
							placeholder='credit-calculator'
						/>

						<InputField
							control={control}
							disabled={!canEditCore}
							label='Название'
							name='name'
							placeholder='Кредитный калькулятор'
						/>

						<TextAreaField
							autoSize={{ maxRows: 4, minRows: 3 }}
							control={control}
							disabled={!canEditCore}
							label='Описание'
							name='description'
							placeholder='MiniApp для расчёта кредита'
						/>

						<InputField
							control={control}
							disabled={!canEditCore}
							label='URL иконки'
							name='iconUrl'
							placeholder='https://example.com/icon.png'
						/>

						<InputField
							control={control}
							disabled={!canEditCore}
							label='URL входа'
							name='entryUrl'
							placeholder='https://example.com/app'
						/>

						<InputField
							control={control}
							disabled={!canEditCore}
							label='Backend URL'
							name='backendUrl'
							placeholder='https://example.com/api'
						/>

						<TextAreaField
							autoSize={{ maxRows: 6, minRows: 4 }}
							control={control}
							disabled={!canEditCore}
							label='Настройки'
							name='settings'
							placeholder='{"theme":"light"}'
						/>
					</div>
				</section>
			)}

			<section className={styles.section}>
				<div className={styles.sectionHeader}>
					<Title className={styles.sectionTitle} level={3}>
						Политика доступа
					</Title>
					<Text type='secondary'>
						{
							'Схема доступа: externalRoles -> Role Mapping -> realmRoles -> политика доступа MiniApp.'
						}
					</Text>
				</div>

				<div className={styles.fieldGrid}>
					<SelectField<RealmMiniAppFormValues, AccessType>
						control={control}
						disabled={!canEditAccess}
						hint={accessType ? accessTypeDescriptions[accessType] : undefined}
						label='Тип доступа'
						name='accessType'
						options={accessTypeOptions}
						placeholder='Выберите тип доступа'
					/>

					{isRoleBased && (
						<>
							<SelectField<RealmMiniAppFormValues, RoleMatchMode>
								control={control}
								disabled={!canEditAccess}
								hint={roleMatchModeHint}
								label='Режим проверки ролей'
								name='roleMatchMode'
								options={roleMatchModeOptions}
								placeholder='ANY'
							/>

							<SelectField<RealmMiniAppFormValues, string>
								allowClear
								className={styles.rolesSelect}
								control={control}
								disabled={!canEditAccess || realmRoles.length === 0}
								hint='Выбирайте роли только из Realm Roles. Вручную роли не вводятся.'
								label='Обязательные роли'
								maxTagCount='responsive'
								maxTagPlaceholder={omittedValues => `+${omittedValues.length}`}
								mode='multiple'
								name='requiredRoles'
								optionFilterProp='label'
								options={roleOptions}
								placeholder='Выберите Realm Roles'
								showSearch
							/>

							{realmRoles.length === 0 && (
								<Alert
									action={
										<Link to={buildRealmRoleCreateRoute(realmCode)}>
											<ButtonField size='small' type='primary'>
												Создать Realm Role
											</ButtonField>
										</Link>
									}
									className={styles.fullWidth}
									message='В Realm нет созданных ролей. Сначала создайте Realm Roles.'
									showIcon
									type='warning'
								/>
							)}
						</>
					)}
				</div>
			</section>

			<div className={styles.actions}>
				{onCancel && <ButtonField onClick={onCancel}>Отмена</ButtonField>}
				<ButtonField
					htmlType='submit'
					type='primary'
					disabled={!isDirty || !isValid}
				>
					{submitLabel}
				</ButtonField>
			</div>
		</form>
	)
}
