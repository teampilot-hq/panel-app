import {FieldSchema, SchemaObject} from "@/core/types/notifications.ts";

export const getVariablesFromSchema = (schema: SchemaObject): { [key: string]: any[] } => {
    const variables: { [key: string]: {
            name: string;
            description: string;
            type: string;
            required: boolean;
            enumValues?: string[];
        }[] } = {};

    const processField = (field: FieldSchema, parentPath = '') => {
        const path = parentPath ? `${parentPath}.${field.name}` : field.name;
        const category = path.split('.')[0];

        if (!variables[category]) {
            variables[category] = [];
        }

        let fieldType = field.type;
        if (field.enumValues?.length) {
            fieldType = `enum(${field.enumValues.join('|')})`;
        } else if (field.items) {
            fieldType = `array<${field.items.type}>`;
        }

        variables[category].push({
            name: `{{${path}}}`,
            description: field.description || `${field.type} field`,
            type: fieldType,
            required: field.required,
            enumValues: field.enumValues
        });

        if (field.properties) {
            field.properties.forEach(prop => processField(prop, path));
        }
    };

    schema.properties.forEach(field => processField(field));
    return variables;
};
