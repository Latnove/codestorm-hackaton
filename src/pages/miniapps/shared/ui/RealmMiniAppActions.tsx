import {
	getRealmMiniAppPublishError,
	type RealmMiniApp,
	type RealmMiniAppFormValues,
} from '@/entities/miniapp'
import type { RealmMiniAppPermissions } from '@/entities/user'
import { useRealmMiniAppsStore } from '@/features/miniapps'
import {
	selectRealmRolesByRealmCode,
	useRealmRolesStore,
} from '@/features/realms'
import {
	buildRealmMiniappAccessRoute,
	buildRealmMiniappRoute,
} from '@/shared/config'
import { ActionsDropdown } from '@/shared/ui/ActionsDropdown'
import { ButtonField } from '@/shared/ui/ButtonField'
import { message, Modal } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'
import {
	buildRealmMiniAppFormValues,
	RealmMiniAppForm,
} from './RealmMiniAppForm'

interface RealmMiniAppActionsProps {
	afterDeletePath?: string
	miniApp: RealmMiniApp
	onDone?: () => void
	permissions: RealmMiniAppPermissions
	showView?: boolean
	variant?: 'dropdown' | 'inline'
}

export const RealmMiniAppActions = ({
	afterDeletePath,
	miniApp,
	onDone,
	permissions,
	showView = true,
	variant = 'dropdown',
}: RealmMiniAppActionsProps) => {
	const navigate = useNavigate()
	const [editOpen, setEditOpen] = useState(false)
	const realmRoles = useRealmRolesStore(
		useShallow(selectRealmRolesByRealmCode(miniApp.realmCode)),
	)
	const publishRealmMiniApp = useRealmMiniAppsStore(
		state => state.publishRealmMiniApp,
	)
	const stopRealmMiniApp = useRealmMiniAppsStore(
		state => state.stopRealmMiniApp,
	)
	const deleteRealmMiniApp = useRealmMiniAppsStore(
		state => state.deleteRealmMiniApp,
	)
	const updateRealmMiniApp = useRealmMiniAppsStore(
		state => state.updateRealmMiniApp,
	)

	const closeAction = () => {
		onDone?.()
	}

	const openRoute = (route: string) => {
		navigate(route)
		closeAction()
	}

	const openEditModal = () => {
		setEditOpen(true)
		closeAction()
	}

	const closeEditModal = () => {
		setEditOpen(false)
	}

	const handleEditFinish = (values: RealmMiniAppFormValues) => {
		updateRealmMiniApp(miniApp.realmCode, miniApp.code, values)
		message.success(`MiniApp ${miniApp.code} обновлён`)
		setEditOpen(false)
	}

	const handlePublish = () => {
		const error = getRealmMiniAppPublishError(miniApp)

		if (error) {
			message.error(error)
			closeAction()
			return
		}

		Modal.confirm({
			content:
				'После публикации он станет доступен пользователям Realm.',
			okText: 'Опубликовать',
			onOk: () => {
				publishRealmMiniApp(miniApp.realmCode, miniApp.code)
				message.success(`MiniApp ${miniApp.code} опубликован`)
				closeAction()
			},
			title: 'Опубликовать MiniApp?',
		})
	}

	const handleStop = () => {
		Modal.confirm({
			content: 'Пользователи больше не смогут запускать его.',
			okText: 'Остановить',
			onOk: () => {
				stopRealmMiniApp(miniApp.realmCode, miniApp.code)
				message.success(`MiniApp ${miniApp.code} остановлен`)
				closeAction()
			},
			title: 'Остановить MiniApp?',
		})
	}

	const handleDelete = () => {
		Modal.confirm({
			content: 'MiniApp исчезнет из каталога этого Realm.',
			okButtonProps: { danger: true },
			okText: 'Удалить',
			onOk: () => {
				deleteRealmMiniApp(miniApp.realmCode, miniApp.code)
				message.success(`MiniApp ${miniApp.code} удалён из Realm`)
				if (afterDeletePath) {
					navigate(afterDeletePath)
				}
				closeAction()
			},
			title: 'Удалить MiniApp из Realm?',
		})
	}

	const actions = [
		showView && permissions.canView
			? {
					danger: false,
					key: 'view',
					label: 'Просмотр',
					onClick: () =>
						openRoute(
							buildRealmMiniappRoute(miniApp.realmCode, miniApp.code),
						),
				}
			: null,
		permissions.canEditMiniApp
			? {
					danger: false,
					key: 'edit',
					label: 'Редактировать',
					onClick: openEditModal,
				}
			: null,
		permissions.canEditAccess
			? {
					danger: false,
					key: 'access',
					label: 'Настроить доступ',
					onClick: () =>
						openRoute(
							buildRealmMiniappAccessRoute(
								miniApp.realmCode,
								miniApp.code,
							),
						),
				}
			: null,
		permissions.canPublish &&
		(miniApp.status === 'DRAFT' || miniApp.status === 'STOPPED')
			? {
					danger: false,
					key: 'publish',
					label: 'Опубликовать',
					onClick: handlePublish,
				}
			: null,
		permissions.canStop && miniApp.status === 'PUBLISHED'
			? {
					danger: false,
					key: 'stop',
					label: 'Остановить',
					onClick: handleStop,
				}
			: null,
		permissions.canDelete
			? {
					danger: true,
					key: 'delete',
					label: 'Удалить',
					onClick: handleDelete,
				}
			: null,
	].filter((action): action is NonNullable<typeof action> => Boolean(action))

	if (variant === 'inline') {
		return (
			<>
				{actions.map(action => (
					<ButtonField
						danger={action.danger}
						key={action.key}
						onClick={action.onClick}
					>
						{action.label}
					</ButtonField>
				))}
				<Modal
					footer={null}
					onCancel={closeEditModal}
					open={editOpen}
					style={{ paddingBottom: 32 }}
					title='Редактировать MiniApp'
					width={680}
				>
					<RealmMiniAppForm
						initialValues={buildRealmMiniAppFormValues(miniApp)}
						mode='edit'
						onCancel={closeEditModal}
						onFinish={handleEditFinish}
						permissions={permissions}
						realmCode={miniApp.realmCode}
						realmRoles={realmRoles}
						submitLabel='Сохранить'
					/>
				</Modal>
			</>
		)
	}

	return (
		<>
			<ActionsDropdown
				label='Действия'
				items={actions.map(action => ({
					danger: action.danger,
					key: action.key,
					label: action.label,
					onClick: action.onClick,
				}))}
			/>
			<Modal
				footer={null}
				onCancel={closeEditModal}
				open={editOpen}
				style={{ paddingBottom: 32 }}
				title='Редактировать MiniApp'
				width={680}
			>
				<RealmMiniAppForm
					initialValues={buildRealmMiniAppFormValues(miniApp)}
					mode='edit'
					onCancel={closeEditModal}
					onFinish={handleEditFinish}
					permissions={permissions}
					realmCode={miniApp.realmCode}
					realmRoles={realmRoles}
					submitLabel='Сохранить'
				/>
			</Modal>
		</>
	)
}
