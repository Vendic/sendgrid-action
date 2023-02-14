import * as core from '@actions/core'
import {Response} from "@sendgrid/helpers/classes";
import {ClientResponse} from "@sendgrid/client/src/response";

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
            core.info(`Adding dynamic data: ${item} = ${process.env[item]}`)
            dynamicData[item] = process.env[item] as string;
        })

        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(sendgridApiKey);
        const msg = {
            to: to.split(','),
            from: from,
            templateId: templateId,
            dynamicTemplateData: {
                ...dynamicData
            }
        };

        try {
            const result : ClientResponse = await sgMail.send(msg);
            if (Array.isArray(result)) {
                result.forEach((item: Response) => {
                    core.info(`Email sent successfully. Status code: ${item.statusCode}`);
                })
            }
        } catch (error) {
            const isError = (err: unknown): err is Error => err instanceof Error;

            if (isError(error)) {
                core.error(`Error message: ${error.message}`)
            }
        }

        core.info('Email sent successfully')
    } catch (error) {
        core.setFailed(`Action failed: ${error}`)
    }
}
