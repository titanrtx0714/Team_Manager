import { SetMetadata } from '@nestjs/common';
import { FEATURE_METADATA } from '@gauzy/common';
import { FeatureEnum } from '@gauzy/contracts';

export const FeatureFlag = (feature: FeatureEnum) => SetMetadata(FEATURE_METADATA, feature);