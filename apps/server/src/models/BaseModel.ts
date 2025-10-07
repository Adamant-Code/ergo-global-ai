import { Model, AjvValidator } from "objection";
import addFormats from "ajv-formats";

export abstract class BaseModel extends Model {
  createdAt!: string;
  updatedAt!: string;

  static createValidator(): AjvValidator {
    return new AjvValidator({
      onCreateAjv: (ajv) => {
        addFormats.default(ajv);
      },
      options: {
        allErrors: true,
        validateSchema: false,
        ownProperties: true,
      },
    });
  }

  $beforeInsert(): void {
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate(): void {
    this.updatedAt = new Date().toISOString();
  }
}
