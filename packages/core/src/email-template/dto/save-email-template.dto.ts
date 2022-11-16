import { EmailTemplateNameEnum, IEmailTemplateSaveInput, LanguagesEnum } from "@gauzy/contracts";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { TenantOrganizationBaseDTO } from "../../core/dto";

/**
 * Save email template request DTO validation
 */
export class SaveEmailTemplateDTO extends TenantOrganizationBaseDTO
    implements IEmailTemplateSaveInput {

    @ApiProperty({ type: () => String, enum: LanguagesEnum })
    @IsString()
	readonly languageCode: LanguagesEnum;

    @ApiProperty({ type: () => String, enum: EmailTemplateNameEnum })
    @IsEnum(EmailTemplateNameEnum)
	readonly name: EmailTemplateNameEnum;

    @ApiProperty({ type: () => String })
    @IsNotEmpty()
	readonly mjml: string;

    @ApiProperty({ type: () => String })
    @IsNotEmpty()
	readonly subject: string;
}