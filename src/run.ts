import * as core from '@actions/core'

type DynamicData = {
    [key: string]: string
}

export default async function run(): Promise<void> {
    try {
        const sendgridApiKey = core.getInput('sendgrid_api_key', {required: true})
        const to = core.getInput('to', {required: true})
        const from = core.getInput('from', {required: true})
        const templateId = core.getInput('template_id', {required: true})
        const dynamicTemplateDataVariableNames = core.getMultilineInput('dynamic_template_data', {required: false})
        let dynamicData : DynamicData = {}

        await dynamicTemplateDataVariableNames.forEach((item: string) => {
            if (typeof item !== "string") {
                return;
            }
            if (!process.env[item]) {
                return;
            }
            dynamicData[item] = process.env[item] as string;
        })

        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(sendgridApiKey);
        const msg = {
            to: to,
            from: from,
            templateId: templateId,
            dynamicTemplateData: {
                ...dynamicData
            }
        };

        try {
            await sgMail.send(msg);
        } catch (error) {
            console.error(error);

            // @ts-ignore
            if (error.response) {
                // @ts-ignore
                console.error(error.response.body)
            }
        }

        core.setOutput('message', 'Email sent successfully')
    } catch (error) {
        core.setFailed(`Action failed: ${error}`)
    }
}
