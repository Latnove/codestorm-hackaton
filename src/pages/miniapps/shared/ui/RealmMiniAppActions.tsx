import {
	deleteRealmMiniApp,
	getRealmMiniAppPublishError,
	publishRealmMiniApp,
	realmMiniAppKeys,
	stopRealmMiniApp,
	type RealmMiniApp,
	type RealmMiniAppFormValues,
	updateRealmMiniApp,
} from '@/entities/miniapp'
import type { RealmMiniAppPermissions } from '@/entities/user'
import {
	getRealmRoles,
	realmKeys,
	realmRoleKeys,
} from '@/entities/realm'
import {
	buildRealmMiniappAccessRoute,
	buildRealmMiniappRoute,
} from '@/shared/config'
import { ActionsDropdown } from '@/shared/ui/ActionsDropdown'
import { ButtonField } from '@/shared/ui/ButtonField'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { message, Modal } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
	const queryClient = useQueryClient()
	const [editOpen, setEditOpen] = useState(false)
	const { data: realmRoles = [] } = useQuery({
		enabled: Boolean(miniApp.realmCode),
		queryFn: () => getRealmRoles(miniApp.realmCode),
		queryKey: realmRoleKeys.list(miniApp.realmCode),
	})
	const invalidateMiniApp = () => {
		void queryClient.invalidateQueries({
			queryKey: realmMiniAppKeys.lists(miniApp.realmCode),
		})
		void queryClient.invalidateQueries({
			queryKey: realmMiniAppKeys.detail(miniApp.realmCode, miniApp.code),
		})
		void queryClient.invalidateQueries({
			queryKey: realmKeys.detail(miniApp.realmCode),
		})
		void queryClient.invalidateQueries({ queryKey: realmKeys.lists() })
	}
	const closeAction = () => {
		onDone?.()
	}
	const updateMiniAppMutation = useMutation({
		mutationFn: (values: RealmMiniAppFormValues) =>
			updateRealmMiniApp(miniApp.realmCode, miniApp.code, values),
		onSuccess: updatedMiniApp => {
			invalidateMiniApp()
			message.success(`MiniApp ${updatedMiniApp.code} обновлён`)
			setEditOpen(false)
		},
		onError: () => {
			message.error(`Не удалось обновить MiniApp ${miniApp.code}`)
		},
	})
	const publishMiniAppMutation = useMutation({
		mutationFn: () => publishRealmMiniApp(miniApp.realmCode, miniApp.code),
		onSuccess: () => {
			invalidateMiniApp()
			message.success(`MiniApp ${miniApp.code} опубликован`)
			closeAction()
		},
		onError: () => {
			message.error(`Не удалось опубликовать MiniApp ${miniApp.code}`)
		},
	})
	const stopMiniAppMutation = useMutation({
		mutationFn: () => stopRealmMiniApp(miniApp.realmCode, miniApp.code),
		onSuccess: () => {
			invalidateMiniApp()
			message.success(`MiniApp ${miniApp.code} остановлен`)
			closeAction()
		},
		onError: () => {
			message.error(`Не удалось остановить MiniApp ${miniApp.code}`)
		},
	})
	const deleteMiniAppMutation = useMutation({
		mutationFn: () => deleteRealmMiniApp(miniApp.realmCode, miniApp.code),
		onSuccess: () => {
			invalidateMiniApp()
			message.success(`MiniApp ${miniApp.code} удалён из Realm`)
			if (afterDeletePath) {
				navigate(afterDeletePath)
			}
			closeAction()
		},
		onError: () => {
			message.error(`Не удалось удалить MiniApp ${miniApp.code}`)
		},
	})

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
		updateMiniAppMutation.mutate(values)
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
				publishMiniAppMutation.mutate()
			},
			title: 'Опубликовать MiniApp?',
		})
	}

	const handleStop = () => {
		Modal.confirm({
			content: 'Пользователи больше не смогут запускать его.',
			okText: 'Остановить',
			onOk: () => {
				stopMiniAppMutation.mutate()
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
				deleteMiniAppMutation.mutate()
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
