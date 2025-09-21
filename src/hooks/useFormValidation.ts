// [AI]
import { useState, useCallback, useEffect } from "react";

export interface ValidationRule<T = any> {
  validator: (value: T, formData?: any) => boolean;
  message: string;
  trigger?: "onChange" | "onBlur" | "onSubmit";
}

export interface FieldConfig<T = any> {
  rules?: ValidationRule<T>[];
  required?: boolean;
  requiredMessage?: string;
}

export interface FormValidationConfig {
  [fieldName: string]: FieldConfig;
}

export interface ValidationError {
  field: string;
  message: string;
}

export function useFormValidation<T extends Record<string, any>>(
  config: FormValidationConfig,
  initialData: T
) {
  const [formData, setFormData] = useState<T>(initialData);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isValidating, setIsValidating] = useState(false);

  // Get field error
  const getFieldError = useCallback(
    (field: string): string | undefined => {
      return errors.find((error) => error.field === field)?.message;
    },
    [errors]
  );

  // Check if field has error
  const hasFieldError = useCallback(
    (field: string): boolean => {
      return errors.some((error) => error.field === field);
    },
    [errors]
  );

  // Validate a single field
  const validateField = useCallback(
    (
      field: string,
      value: any,
      trigger: ValidationRule["trigger"] = "onChange"
    ) => {
      const fieldConfig = config[field];
      if (!fieldConfig) return [];

      const fieldErrors: ValidationError[] = [];

      // Required validation
      if (fieldConfig.required) {
        const isEmpty =
          value === "" ||
          value === null ||
          value === undefined ||
          (Array.isArray(value) && value.length === 0) ||
          (typeof value === "object" && Object.keys(value).length === 0);

        if (isEmpty) {
          fieldErrors.push({
            field,
            message: fieldConfig.requiredMessage || `${field} is required`,
          });
          return fieldErrors; // Don't run other validations if required validation fails
        }
      }

      // Custom rules validation
      if (fieldConfig.rules) {
        for (const rule of fieldConfig.rules) {
          if (rule.trigger && rule.trigger !== trigger) continue;

          if (!rule.validator(value, formData)) {
            fieldErrors.push({
              field,
              message: rule.message,
            });
          }
        }
      }

      return fieldErrors;
    },
    [config, formData]
  );

  // Validate all fields
  const validateForm = useCallback(
    (triggerType: ValidationRule["trigger"] = "onSubmit") => {
      const allErrors: ValidationError[] = [];

      Object.keys(config).forEach((field) => {
        const fieldErrors = validateField(field, formData[field], triggerType);
        allErrors.push(...fieldErrors);
      });

      setErrors(allErrors);
      return allErrors.length === 0;
    },
    [config, formData, validateField]
  );

  // Update field value
  const updateField = useCallback(
    (field: string, value: any) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Real-time validation for touched fields
      if (touched[field]) {
        const fieldErrors = validateField(field, value, "onChange");
        setErrors((prevErrors) => [
          ...prevErrors.filter((error) => error.field !== field),
          ...fieldErrors,
        ]);
      }
    },
    [touched, validateField]
  );

  // Handle field blur
  const handleFieldBlur = useCallback(
    (field: string) => {
      setTouched((prev) => ({ ...prev, [field]: true }));

      // Validate on blur
      const fieldErrors = validateField(field, formData[field], "onBlur");
      setErrors((prevErrors) => [
        ...prevErrors.filter((error) => error.field !== field),
        ...fieldErrors,
      ]);
    },
    [formData, validateField]
  );

  // Clear field error
  const clearFieldError = useCallback((field: string) => {
    setErrors((prevErrors) =>
      prevErrors.filter((error) => error.field !== field)
    );
  }, []);

  // Clear all errors
  const clearAllErrors = useCallback(() => {
    setErrors([]);
  }, []);

  // Reset form
  const resetForm = useCallback(
    (newData?: T) => {
      setFormData(newData || initialData);
      setErrors([]);
      setTouched({});
    },
    [initialData]
  );

  // Get form state
  const isValid = errors.length === 0;
  const hasErrors = errors.length > 0;

  return {
    formData,
    errors,
    touched,
    isValidating,
    isValid,
    hasErrors,
    getFieldError,
    hasFieldError,
    validateField,
    validateForm,
    updateField,
    handleFieldBlur,
    clearFieldError,
    clearAllErrors,
    resetForm,
    setIsValidating,
  };
}
// [/AI]
