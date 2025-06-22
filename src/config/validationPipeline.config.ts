import { ValidationPipeOptions } from '@nestjs/common';

export const validationPipelineConfig: ValidationPipeOptions = {
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
  stopAtFirstError: true,
  validationError: {
    target: false,
    value: false,
  },
};