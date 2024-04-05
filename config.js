import { Regex } from '@companion-module/base'

export const ConfigFields = [
	{
		type: 'static-text',
		id: 'info',
		label: 'Information',
		width: 12,
		value: `
				<div class="alert alert-danger">
                    <h3>IMPORTANT MESSAGE</h3>
                    <div>
                        <strong>Please read and understand the following before using this module</strong>
                        <p>
                        The companion project started out as an attempt to make the everyday life of a technician easier.<br/>
                        </p>
                        <p>
                        This module works with the New MediaMaster 6 software in player Mode.<br/>
                        You can control the remote player on the ArKaos Hub of MediaMaster 6 (ArKaos) with the presets</p>
                        <p>For this module to work, please in MediaMaster activate the remote player</p>
                    </div>
                </div>
			`,
	},
    {
        type: 'textinput',
        id: 'host',
        label: 'Target IP',
        width: 6,
        default: '',
        regex: Regex.IP,
    },
    {
        type: 'textinput',
        id: 'port',
        label: 'Target Port',
        width: 2,
        default: 45678,
        regex: Regex.PORT,
    },

]