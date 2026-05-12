import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import type { AdminCopilotMessage } from './types'

const buildSessionId = () => crypto.randomUUID()

interface AdminCopilotState {
	isOpen: boolean
	sessionId: string
	messages: AdminCopilotMessage[]
}

interface AdminCopilotActions {
	addMessage: (message: AdminCopilotMessage) => void
	clear: () => void
	close: () => void
	open: () => void
	toggle: () => void
	updateMessage: (id: string, patch: Partial<AdminCopilotMessage>) => void
}

type AdminCopilotStore = AdminCopilotState & AdminCopilotActions

const initialState: AdminCopilotState = {
	isOpen: false,
	messages: [],
	sessionId: buildSessionId(),
}

export const useAdminCopilotStore = create<AdminCopilotStore>()(
	devtools(
		persist(
			set => ({
				...initialState,

				addMessage: message => {
					set(
						state => ({
							messages: [...state.messages, message],
						}),
						false,
						'admin-copilot/addMessage',
					)
				},

				clear: () => {
					set(
						{
							messages: [],
							sessionId: buildSessionId(),
						},
						false,
						'admin-copilot/clear',
					)
				},

				close: () => {
					set({ isOpen: false }, false, 'admin-copilot/close')
				},

				open: () => {
					set({ isOpen: true }, false, 'admin-copilot/open')
				},

				toggle: () => {
					set(
						state => ({ isOpen: !state.isOpen }),
						false,
						'admin-copilot/toggle',
					)
				},

				updateMessage: (id, patch) => {
					set(
						state => ({
							messages: state.messages.map(message =>
								message.id === id ? { ...message, ...patch } : message,
							),
						}),
						false,
						'admin-copilot/updateMessage',
					)
				},
			}),
			{
				name: 'admin-copilot-store',
				partialize: state => ({
					isOpen: state.isOpen,
					messages: state.messages,
					sessionId: state.sessionId,
				}),
			},
		),
		{ name: 'admin-copilot-store' },
	),
)
