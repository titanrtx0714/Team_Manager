import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";
import * as Email from 'email-templates';
import { ISMTPConfig, isEmpty } from "@gauzy/common";
import { IBasePerTenantAndOrganizationEntityModel, IVerifySMTPTransport } from "@gauzy/contracts";
import { EmailTemplate } from "./../core/entities/internal";
import { RequestContext } from "./../core/context";
import { CustomSmtpService } from "./../custom-smtp/custom-smtp.service";
import { EmailTemplateRender } from "./email-template.render";
import { SMTPUtils } from "./utils";
// import { environment } from '@gauzy/config';

@Injectable()
export class EmailSendService extends EmailTemplateRender {

    constructor(
        @InjectRepository(EmailTemplate)
        protected readonly repository: Repository<EmailTemplate>,

        private readonly customSmtpService: CustomSmtpService,
    ) {
        super(repository);
    }

    /**
     *
     * @returns
     */
    public async getInstance(): Promise<Email<any>> {
        try {
            const smtpConfig: ISMTPConfig = SMTPUtils.defaultSMTPTransporter();
            const transport: IVerifySMTPTransport = SMTPUtils.convertSmtpToTransporter(smtpConfig);

            console.log('Default SMTP configuration: %s', transport);

            /** Verifies SMTP configuration */
            if (!!await SMTPUtils.verifyTransporter(transport)) {
                return this.getEmailConfig(smtpConfig);
            }
        } catch (error) {
            console.log('Error while retrieving default global smtp configuration: %s', error);
            throw new InternalServerErrorException(error);
        }
    }

    /**
     *
     * @param param0
     */
    public async getEmailInstance({
        organizationId,
        tenantId = RequestContext.currentTenantId()
    }: IBasePerTenantAndOrganizationEntityModel) {
        try {
            const smtpTransporter = await this.customSmtpService.findOneByOptions({
                where: {
                    organizationId: isEmpty(organizationId) ? IsNull() : organizationId,
                    tenantId: isEmpty(tenantId) ? IsNull() : tenantId
                },
                order: {
                    createdAt: 'DESC'
                }
            });

            const smtpConfig: ISMTPConfig = smtpTransporter.getSmtpTransporter();
            const transport: IVerifySMTPTransport = SMTPUtils.convertSmtpToTransporter(smtpConfig);

            /** Verifies SMTP configuration */
            if (!!await SMTPUtils.verifyTransporter(transport)) {
                return this.getEmailConfig(smtpConfig);
            } else {
                console.log('SMTP configuration is not set for this tenant / organization: [%s, %s]', organizationId, tenantId);
                throw new BadRequestException('SMTP configuration is not set for this tenant / organization');
            }
        } catch (error) {
            try {
                if (error instanceof NotFoundException) {
                    const smtpTransporter = await this.customSmtpService.findOneByOptions({
                        where: {
                            organizationId: IsNull(),
                            tenantId: isEmpty(tenantId) ? IsNull() : tenantId
                        },
                        order: {
                            createdAt: 'DESC'
                        }
                    });

                    const smtpConfig: ISMTPConfig = smtpTransporter.getSmtpTransporter();
                    const transport: IVerifySMTPTransport = SMTPUtils.convertSmtpToTransporter(smtpConfig);

                    /** Verifies SMTP configuration */
                    if (!!await SMTPUtils.verifyTransporter(transport)) {
                        return this.getEmailConfig(smtpConfig);
                    } else {
                        console.log('SMTP configuration is not set for this tenant: %s', organizationId);
                        throw new BadRequestException('SMTP configuration is not set for this tenant');
                    }
                }
            } catch (error) {
                console.log('Error while retrieving tenant/organization smtp configuration: %s', error);
                throw new InternalServerErrorException(error);
            }
        }
    }

    /**
     *
     * @param smtpConfig
     * @returns
     */
    private getEmailConfig(smtpConfig: ISMTPConfig): Email<any> {
        const config: Email.EmailConfig<any> = {
            message: {
                from: smtpConfig.fromAddress || 'noreply@gauzy.co'
            },
            // if you want to send emails in development or test environments, set options.send to true.
            send: true,
            transport: smtpConfig,
            i18n: {},
            views: {
                options: {
                    extension: 'hbs'
                }
            },
            render: this.render
        };
        /**
         * TODO: uncomment this after we figure out issues with dev / prod in the environment.*.ts
         */
        // if (!environment.production && !environment.demo) {
        //     config.preview = {
        //         open: {
        //             app: 'firefox',
        //             wait: false
        //         }
        //     };
        // }
        return new Email(config);
    }
}
