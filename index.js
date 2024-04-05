import { InstanceBase, InstanceStatus, runEntrypoint, TCPHelper } from '@companion-module/base'
import { ConfigFields } from './config.js'
import { initPresets } from './presets.js'
import { FIELDS } from './fields.js'
  
class GenericTcpUdpInstance extends InstanceBase {
	async init(config) {
		this.config = config
		this.initActions()
		this.setPresetDefinitions(initPresets())
		await this.configUpdated(config)
		
	}

	async configUpdated(config) {
		if (this.socket) {
			this.socket.destroy()
			delete this.socket
		}

		this.config = config

		this.init_tcp()

		this.init_tcp_variables()

	}

	async destroy() {
		if (this.socket) {
			this.socket.destroy()
		} else {
			this.updateStatus(InstanceStatus.Disconnected)
		}
	}

	// Return config fields for web config
	getConfigFields() {
		return ConfigFields
	}

	init_tcp() {
		if (this.socket) {
			this.socket.destroy()
			delete this.socket
		}

		this.updateStatus(InstanceStatus.Connecting)

		if (this.config.host) {
			this.socket = new TCPHelper(this.config.host, this.config.port)

			this.socket.on('status_change', (status, message) => {
				this.updateStatus(status, message)
			})

			this.socket.on('error', (err) => {
				this.updateStatus(InstanceStatus.ConnectionFailure, err.message)
				this.log('error', 'Network error: ' + err.message)
			})

			this.socket.on('data', (data) => {
				if (this.config.saveresponse) {
					let dataResponse = data

					if (this.config.convertresponse == 'string') {
						dataResponse = data.toString()
					} else if (this.config.convertresponse == 'hex') {
						dataResponse = data.toString('hex')
					}

					this.setVariableValues({ tcp_response: dataResponse })
				}
			})
		} else {
			this.updateStatus(InstanceStatus.BadConfig)
		}
	}

	init_tcp_variables() {
		this.setVariableDefinitions([{ name: 'Last TCP Response', variableId: 'tcp_response' }])

		this.setVariableValues({ tcp_response: '' })
	}
	
	initActions() {
		this.setActionDefinitions({	
			send: {
			  name: 'Send command',
			  options: [FIELDS.cmd],
			  callback: async (action, context) => {			  
				if (action.options && action.options.cmd) {
				  const command = action.options.cmd + '\r\n';
				  if (command != '') {
					  if (this.socket !== undefined && this.socket.isConnected) {
						  this.socket.send(command)
						  this.log('info', 'sending ' + command + ' to ' + this.config.host + ':'+ this.config.port)
					  } else {
						  this.log('info', 'Socket not connected :(')
					  }
				  }
				}
			  },
			},	
		})
	}
	
}

runEntrypoint(GenericTcpUdpInstance, [])