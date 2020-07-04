import { ApiBody } from "@nestjs/swagger";

export const ApiFile = (fileName = 'file', description?: string): MethodDecorator => (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
) => {
    ApiBody({
        required: true,
        description,
        schema: {
            type: 'object',
            required: ['true'],
            properties: {
                [fileName]: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })(target, propertyKey, descriptor);
};