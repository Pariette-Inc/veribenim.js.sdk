import type {
  VeribenimInternalConfig,
  FormSchema,
  FormField,
  ConditionalLogic,
  RenderFormOptions,
  FormSubmitPayload,
  FormSubmitResponse,
} from './types';
import { VeribenimApiClient } from './client';

export class FormRenderer {
  private client: VeribenimApiClient;
  private schema: FormSchema;
  private container: HTMLElement;
  private options: RenderFormOptions;
  private currentStep: number = 0;
  private fieldValues: Record<string, any> = {};
  private styleId: string;

  constructor(
    client: VeribenimApiClient,
    schema: FormSchema,
    container: HTMLElement,
    options: RenderFormOptions
  ) {
    this.client = client;
    this.schema = schema;
    this.container = container;
    this.options = options;
    this.styleId = `vb-styles-${schema.slug}`;
  }

  static async render(
    config: VeribenimInternalConfig,
    slug: string,
    selector: string,
    options: RenderFormOptions = {}
  ): Promise<void> {
    const container = document.querySelector(selector) as HTMLElement;
    if (!container) throw new Error(`Selector bulunamadı: ${selector}`);

    const client = new VeribenimApiClient(config);
    const schema = await client.getFormSchema(slug, options.lang);
    const renderer = new FormRenderer(client, schema, container, options);
    renderer.mount();
  }

  private mount(): void {
    this.injectStyles();
    this.render();
  }

  private injectStyles(): void {
    if (document.getElementById(this.styleId)) return;

    const primaryColor = this.options.theme?.primaryColor || '#6366f1';
    const borderRadius = this.options.theme?.borderRadius || '8px';
    const fontFamily = this.options.theme?.fontFamily || 'inherit';

    const style = document.createElement('style');
    style.id = this.styleId;
    style.textContent = `
      .vb-form { font-family: ${fontFamily}; max-width: 600px; margin: 0 auto; padding: 24px; box-sizing: border-box; }
      .vb-form *, .vb-form *::before, .vb-form *::after { box-sizing: border-box; }
      .vb-form-title { font-size: 1.5rem; font-weight: 700; margin-bottom: 8px; color: #111827; }
      .vb-form-desc { color: #6b7280; margin-bottom: 24px; }
      .vb-field { margin-bottom: 20px; }
      .vb-field.vb-hidden { display: none; }
      .vb-label { display: block; font-weight: 600; font-size: 0.875rem; color: #374151; margin-bottom: 6px; }
      .vb-required { color: #ef4444; margin-left: 2px; }
      .vb-help { font-size: 0.75rem; color: #9ca3af; margin-top: 4px; }
      .vb-input, .vb-textarea, .vb-select {
        width: 100%; padding: 10px 14px; border: 1px solid #d1d5db; border-radius: ${borderRadius};
        font-size: 0.875rem; outline: none; transition: border-color 0.15s; background: #fff; color: #111827;
      }
      .vb-input:focus, .vb-textarea:focus, .vb-select:focus { border-color: ${primaryColor}; box-shadow: 0 0 0 3px ${primaryColor}22; }
      .vb-textarea { resize: vertical; min-height: 100px; }
      .vb-radio-group, .vb-checkbox-group { display: flex; flex-direction: column; gap: 8px; }
      .vb-radio-item, .vb-checkbox-item { display: flex; align-items: center; gap: 8px; cursor: pointer; }
      .vb-radio-item input, .vb-checkbox-item input { accent-color: ${primaryColor}; width: 16px; height: 16px; }
      .vb-rating { display: flex; gap: 4px; }
      .vb-rating-star { font-size: 1.5rem; cursor: pointer; color: #d1d5db; transition: color 0.1s; }
      .vb-rating-star.active { color: #f59e0b; }
      .vb-divider { border: none; border-top: 1px solid #e5e7eb; margin: 8px 0; }
      .vb-heading { font-size: 1.125rem; font-weight: 600; color: #111827; margin-bottom: 4px; }
      .vb-error { color: #ef4444; font-size: 0.75rem; margin-top: 4px; }
      .vb-submit-btn {
        width: 100%; padding: 12px 24px; background: ${primaryColor}; color: #fff; border: none;
        border-radius: ${borderRadius}; font-size: 1rem; font-weight: 600; cursor: pointer; transition: opacity 0.15s;
      }
      .vb-submit-btn:hover { opacity: 0.9; }
      .vb-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
      .vb-step-nav { display: flex; justify-content: space-between; margin-top: 16px; gap: 12px; }
      .vb-btn-secondary {
        padding: 10px 20px; background: #f3f4f6; color: #374151; border: none;
        border-radius: ${borderRadius}; font-size: 0.875rem; cursor: pointer;
      }
      .vb-step-indicator { display: flex; align-items: center; gap: 8px; margin-bottom: 24px; }
      .vb-step-dot { width: 28px; height: 28px; border-radius: 50%; background: #e5e7eb; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 600; color: #6b7280; }
      .vb-step-dot.active { background: ${primaryColor}; color: #fff; }
      .vb-step-dot.done { background: #10b981; color: #fff; }
      .vb-step-line { flex: 1; height: 2px; background: #e5e7eb; }
      .vb-success { text-align: center; padding: 40px 24px; }
      .vb-success-icon { font-size: 3rem; margin-bottom: 16px; }
      .vb-success-title { font-size: 1.25rem; font-weight: 700; color: #111827; margin-bottom: 8px; }
      .vb-success-msg { color: #6b7280; }
      .vb-badge { display: flex; align-items: center; justify-content: flex-end; gap: 4px; margin-top: 24px; padding-top: 12px; border-top: 1px solid #f3f4f6; }
      .vb-badge svg { width: 12px; height: 12px; stroke: #9ca3af; fill: none; }
      .vb-badge span { font-size: 0.7rem; color: #9ca3af; }
    `;
    document.head.appendChild(style);
  }

  private render(): void {
    this.container.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'vb-form';

    // Form title
    if (this.schema.name) {
      const title = document.createElement('div');
      title.className = 'vb-form-title';
      title.textContent = this.schema.name;
      wrapper.appendChild(title);
    }

    // Step indicator (multi-step)
    if (this.schema.type === 'multi_step' && this.schema.steps.length > 1) {
      wrapper.appendChild(this.renderStepIndicator());
    }

    // Fields
    const fields = this.getCurrentFields();
    fields.forEach((field) => {
      const el = this.renderField(field);
      if (el) wrapper.appendChild(el);
    });

    // Navigation buttons
    wrapper.appendChild(this.renderNavigation());

    // VeriBenim badge
    wrapper.appendChild(this.renderBadge());

    this.container.appendChild(wrapper);

    // Conditional logic başlat
    this.updateConditionalFields();

    // Field değişikliklerini dinle
    this.attachFieldListeners();
  }

  private getCurrentFields(): FormField[] {
    if (this.schema.type === 'multi_step' && this.schema.steps.length > 0) {
      const step = this.schema.steps[this.currentStep];
      return step?.fields || [];
    }
    return this.schema.fields || [];
  }

  private renderStepIndicator(): HTMLElement {
    const nav = document.createElement('div');
    nav.className = 'vb-step-indicator';
    this.schema.steps.forEach((step, i) => {
      const dot = document.createElement('div');
      dot.className =
        'vb-step-dot' +
        (i < this.currentStep ? ' done' : i === this.currentStep ? ' active' : '');
      dot.textContent = i < this.currentStep ? '✓' : String(i + 1);
      nav.appendChild(dot);
      if (i < this.schema.steps.length - 1) {
        const line = document.createElement('div');
        line.className = 'vb-step-line';
        nav.appendChild(line);
      }
    });
    return nav;
  }

  private renderField(field: FormField): HTMLElement | null {
    const wrapper = document.createElement('div');
    wrapper.className = 'vb-field';

    if (field.type === 'divider') {
      const hr = document.createElement('hr');
      hr.className = 'vb-divider';
      wrapper.appendChild(hr);
      return wrapper;
    }

    if (field.type === 'heading') {
      const h = document.createElement('div');
      h.className = 'vb-heading';
      h.textContent = field.label;
      wrapper.appendChild(h);
      return wrapper;
    }

    // Consent field — kendi label'ını taşır, ayrı label gösterme
    if (field.type === 'consent') {
      const input = this.createInputElement(field);
      if (input) wrapper.appendChild(input);
      // Error placeholder
      const error = document.createElement('div');
      error.className = 'vb-error';
      error.dataset.errorFor = field.uuid;
      error.style.display = 'none';
      wrapper.appendChild(error);
      return wrapper;
    }

    // Label
    const label = document.createElement('label');
    label.className = 'vb-label';
    label.textContent = field.label;
    if (field.required) {
      const req = document.createElement('span');
      req.className = 'vb-required';
      req.textContent = ' *';
      label.appendChild(req);
    }
    wrapper.appendChild(label);

    // Help text
    if (field.help_text) {
      const help = document.createElement('div');
      help.className = 'vb-help';
      help.textContent = field.help_text;
      wrapper.appendChild(help);
    }

    // Input element
    const input = this.createInputElement(field);
    if (input) wrapper.appendChild(input);

    // Error placeholder
    const error = document.createElement('div');
    error.className = 'vb-error';
    error.dataset.errorFor = field.uuid;
    error.style.display = 'none';
    wrapper.appendChild(error);

    return wrapper;
  }

  private createInputElement(field: FormField): HTMLElement | null {
    switch (field.type) {
      case 'input':
      case 'email':
      case 'phone':
      case 'number': {
        const input = document.createElement('input');
        input.className = 'vb-input';
        input.type =
          field.type === 'number'
            ? 'number'
            : field.type === 'email'
              ? 'email'
              : field.type === 'phone'
                ? 'tel'
                : 'text';
        input.placeholder = field.placeholder || '';
        input.dataset.fieldUuid = field.uuid;
        if (field.validation?.min !== undefined) input.min = String(field.validation.min);
        if (field.validation?.max !== undefined) input.max = String(field.validation.max);
        return input;
      }
      case 'textarea': {
        const ta = document.createElement('textarea');
        ta.className = 'vb-textarea';
        ta.placeholder = field.placeholder || '';
        ta.rows = field.settings?.rows || 4;
        ta.dataset.fieldUuid = field.uuid;
        return ta;
      }
      case 'date': {
        const input = document.createElement('input');
        input.className = 'vb-input';
        input.type = 'date';
        input.dataset.fieldUuid = field.uuid;
        return input;
      }
      case 'dropdown': {
        const select = document.createElement('select');
        select.className = 'vb-select';
        select.dataset.fieldUuid = field.uuid;
        const empty = document.createElement('option');
        empty.value = '';
        empty.textContent = field.placeholder || 'Seçiniz...';
        select.appendChild(empty);
        (field.options || []).forEach((opt) => {
          const o = document.createElement('option');
          o.value = opt.value;
          o.textContent = opt.label;
          select.appendChild(o);
        });
        return select;
      }
      case 'radio': {
        const group = document.createElement('div');
        group.className = 'vb-radio-group';
        (field.options || []).forEach((opt) => {
          const item = document.createElement('label');
          item.className = 'vb-radio-item';
          const input = document.createElement('input');
          input.type = 'radio';
          input.name = field.uuid;
          input.value = opt.value;
          input.dataset.fieldUuid = field.uuid;
          const span = document.createElement('span');
          span.textContent = opt.label;
          item.appendChild(input);
          item.appendChild(span);
          group.appendChild(item);
        });
        return group;
      }
      case 'checkbox': {
        const group = document.createElement('div');
        group.className = 'vb-checkbox-group';
        (field.options || []).forEach((opt) => {
          const item = document.createElement('label');
          item.className = 'vb-checkbox-item';
          const input = document.createElement('input');
          input.type = 'checkbox';
          input.value = opt.value;
          input.dataset.fieldUuid = field.uuid;
          const span = document.createElement('span');
          span.textContent = opt.label;
          item.appendChild(input);
          item.appendChild(span);
          group.appendChild(item);
        });
        return group;
      }
      case 'file': {
        const input = document.createElement('input');
        input.className = 'vb-input';
        input.type = 'file';
        input.dataset.fieldUuid = field.uuid;
        if (field.settings?.multiple) input.multiple = true;
        if (field.validation?.file_types?.length) {
          input.accept = field.validation.file_types.join(',');
        }
        return input;
      }
      case 'rating': {
        const maxRating = field.settings?.max_rating || 5;
        const wrapper = document.createElement('div');
        wrapper.className = 'vb-rating';
        wrapper.dataset.fieldUuid = field.uuid;
        wrapper.dataset.value = '0';
        for (let i = 1; i <= maxRating; i++) {
          const star = document.createElement('span');
          star.className = 'vb-rating-star';
          star.textContent = '★';
          star.dataset.value = String(i);
          star.addEventListener('click', () => {
            wrapper.dataset.value = String(i);
            this.fieldValues[field.uuid] = i;
            wrapper.querySelectorAll('.vb-rating-star').forEach((s: any, idx) => {
              s.classList.toggle('active', idx < i);
            });
          });
          wrapper.appendChild(star);
        }
        return wrapper;
      }
      case 'consent': {
        const consentWrap = document.createElement('div');
        consentWrap.className = 'vb-consent-field';

        const consentLabel = document.createElement('label');
        consentLabel.className = 'vb-consent-label';
        consentLabel.style.display = 'flex';
        consentLabel.style.alignItems = 'flex-start';
        consentLabel.style.gap = '8px';
        consentLabel.style.cursor = 'pointer';

        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.dataset.fieldUuid = field.uuid;
        cb.style.marginTop = '3px';
        cb.style.flexShrink = '0';

        const textSpan = document.createElement('span');
        textSpan.style.fontSize = '0.875rem';
        textSpan.style.lineHeight = '1.4';

        // consent_text parse: {policy_title} → tıklanabilir link
        const consentText = field.settings?.consent_text || "{policy_title}'nı okudum ve onaylıyorum";
        const policyTitle = field.settings?.policy_title || 'Politika Metni';
        const policyContent = field.settings?.policy_content || '';

        const parts = consentText.split('{policy_title}');
        if (parts.length > 1) {
          parts.forEach((part: string, idx: number) => {
            if (part) textSpan.appendChild(document.createTextNode(part));
            if (idx < parts.length - 1) {
              const link = document.createElement('a');
              link.href = '#';
              link.textContent = policyTitle;
              link.style.color = '#6366f1';
              link.style.textDecoration = 'underline';
              link.style.fontWeight = '600';
              link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showPolicyModal(policyTitle, policyContent);
              });
              textSpan.appendChild(link);
            }
          });
        } else {
          textSpan.textContent = consentText;
        }

        if (field.required) {
          const req = document.createElement('span');
          req.style.color = '#ef4444';
          req.textContent = ' *';
          textSpan.appendChild(req);
        }

        consentLabel.appendChild(cb);
        consentLabel.appendChild(textSpan);
        consentWrap.appendChild(consentLabel);
        return consentWrap;
      }
      default:
        return null;
    }
  }

  /** Policy içeriğini modal olarak göster */
  private showPolicyModal(title: string, content: string): void {
    // Overlay
    const overlay = document.createElement('div');
    overlay.className = 'vb-policy-overlay';
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:999999;display:flex;align-items:center;justify-content:center;padding:16px;';

    // Modal
    const modal = document.createElement('div');
    modal.className = 'vb-policy-modal';
    modal.style.cssText = 'background:#fff;border-radius:12px;max-width:640px;width:100%;max-height:80vh;display:flex;flex-direction:column;box-shadow:0 25px 50px -12px rgba(0,0,0,0.25);';

    // Header
    const header = document.createElement('div');
    header.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #e2e8f0;flex-shrink:0;';
    const h = document.createElement('h3');
    h.style.cssText = 'font-size:1rem;font-weight:800;color:#0f172a;margin:0;';
    h.textContent = title;
    const closeBtn = document.createElement('button');
    closeBtn.style.cssText = 'background:none;border:none;font-size:1.25rem;cursor:pointer;color:#94a3b8;padding:4px;';
    closeBtn.textContent = '✕';
    closeBtn.addEventListener('click', () => overlay.remove());
    header.appendChild(h);
    header.appendChild(closeBtn);

    // Body
    const body = document.createElement('div');
    body.style.cssText = 'padding:20px;overflow-y:auto;flex:1;font-size:0.875rem;color:#334155;line-height:1.6;';
    body.innerHTML = content;

    // Footer
    const footer = document.createElement('div');
    footer.style.cssText = 'padding:12px 20px;border-top:1px solid #e2e8f0;text-align:right;flex-shrink:0;';
    const okBtn = document.createElement('button');
    okBtn.style.cssText = 'background:#6366f1;color:#fff;border:none;padding:8px 24px;border-radius:8px;font-weight:600;font-size:0.875rem;cursor:pointer;';
    okBtn.textContent = 'Tamam';
    okBtn.addEventListener('click', () => overlay.remove());
    footer.appendChild(okBtn);

    modal.appendChild(header);
    modal.appendChild(body);
    modal.appendChild(footer);
    overlay.appendChild(modal);

    // Overlay click to close
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.remove();
    });

    // Shadow DOM dışına çıkıp document.body'ye ekle (shadow DOM z-index sorunu)
    document.body.appendChild(overlay);
  }

  private renderNavigation(): HTMLElement {
    const nav = document.createElement('div');
    nav.className = 'vb-step-nav';

    const isMultiStep = this.schema.type === 'multi_step';
    const isLastStep = !isMultiStep || this.currentStep === this.schema.steps.length - 1;
    const isFirstStep = this.currentStep === 0;

    if (isMultiStep && !isFirstStep) {
      const prev = document.createElement('button');
      prev.className = 'vb-btn-secondary';
      prev.textContent = '← Geri';
      prev.type = 'button';
      prev.addEventListener('click', () => {
        this.currentStep--;
        this.render();
      });
      nav.appendChild(prev);
    } else {
      nav.appendChild(document.createElement('div')); // spacer
    }

    const submitBtn = document.createElement('button');
    submitBtn.className = 'vb-submit-btn';
    submitBtn.type = 'button';
    submitBtn.textContent = isLastStep
      ? this.schema.settings?.submit_button_text || 'Gönder'
      : 'Devam →';
    submitBtn.addEventListener('click', () => {
      if (isLastStep) {
        this.handleSubmit(submitBtn);
      } else {
        if (this.validateCurrentStep()) {
          this.currentStep++;
          this.render();
        }
      }
    });
    nav.appendChild(submitBtn);

    return nav;
  }

  private renderBadge(): HTMLElement {
    const badge = document.createElement('div');
    badge.className = 'vb-badge';
    badge.innerHTML = `
      <svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>
      <span>VeriBenim ile kişisel verileriniz koruma altında</span>
    `;
    return badge;
  }

  private attachFieldListeners(): void {
    const fields = this.getCurrentFields();
    fields.forEach((field) => {
      if (field.type === 'radio') {
        this.container.querySelectorAll(`input[name="${field.uuid}"]`).forEach((input) => {
          input.addEventListener('change', (e) => {
            this.fieldValues[field.uuid] = (e.target as HTMLInputElement).value;
            this.updateConditionalFields();
          });
        });
      } else if (field.type === 'checkbox') {
        this.container.querySelectorAll(`input[data-field-uuid="${field.uuid}"]`).forEach((input) => {
          input.addEventListener('change', () => {
            const checked = Array.from(
              this.container.querySelectorAll(
                `input[data-field-uuid="${field.uuid}"]:checked`
              )
            ).map((el: any) => el.value);
            this.fieldValues[field.uuid] = checked;
            this.updateConditionalFields();
          });
        });
      } else if (field.type === 'consent') {
        const consentCb = this.container.querySelector(
          `input[data-field-uuid="${field.uuid}"]`
        ) as HTMLInputElement;
        if (consentCb) {
          consentCb.addEventListener('change', () => {
            this.fieldValues[field.uuid] = consentCb.checked ? 'true' : '';
          });
        }
      } else if (field.type !== 'rating') {
        const el = this.container.querySelector(
          `[data-field-uuid="${field.uuid}"]`
        ) as HTMLInputElement;
        if (el) {
          el.addEventListener('input', (e) => {
            this.fieldValues[field.uuid] = (e.target as HTMLInputElement).value;
            this.updateConditionalFields();
          });
        }
      }
    });
  }

  private evaluateCondition(logic: ConditionalLogic): boolean {
    const results = logic.conditions.map((cond) => {
      const fieldValue = String(this.fieldValues[cond.field_uuid] || '');
      switch (cond.operator) {
        case 'equals':
          return fieldValue === cond.value;
        case 'not_equals':
          return fieldValue !== cond.value;
        case 'contains':
          return fieldValue.includes(cond.value);
        case 'not_contains':
          return !fieldValue.includes(cond.value);
        case 'is_empty':
          return !fieldValue;
        case 'is_not_empty':
          return !!fieldValue;
        default:
          return true;
      }
    });

    const conditionMet =
      logic.logic === 'and' ? results.every(Boolean) : results.some(Boolean);
    return logic.action === 'show' ? conditionMet : !conditionMet;
  }

  private updateConditionalFields(): void {
    const fields = this.getCurrentFields();
    fields.forEach((field) => {
      if (!field.conditional_logic?.conditions?.length) return;
      const el = this.container
        .querySelector(`[data-field-uuid="${field.uuid}"]`)
        ?.closest('.vb-field') as HTMLElement;
      if (!el) return;
      const shouldShow = this.evaluateCondition(field.conditional_logic);
      el.classList.toggle('vb-hidden', !shouldShow);
    });
  }

  private validateCurrentStep(): boolean {
    const fields = this.getCurrentFields();
    let valid = true;

    fields.forEach((field) => {
      const fieldEl = this.container.querySelector(`[data-field-uuid="${field.uuid}"]`);
      const fieldWrapper = fieldEl?.closest('.vb-field') as HTMLElement;
      if (fieldWrapper?.classList.contains('vb-hidden')) return;

      const errorEl = this.container.querySelector(
        `[data-error-for="${field.uuid}"]`
      ) as HTMLElement;
      if (!errorEl) return;

      if (field.required) {
        const value = this.getFieldValue(field);
        const isEmpty =
          !value ||
          (Array.isArray(value) && value.length === 0) ||
          value === '' ||
          value === 0;
        if (isEmpty) {
          errorEl.textContent = field.type === 'consent'
            ? 'Bu onayı kabul etmeniz gerekmektedir.'
            : `${field.label} zorunludur.`;
          errorEl.style.display = 'block';
          valid = false;
        } else {
          errorEl.style.display = 'none';
        }
      }
    });

    return valid;
  }

  private getFieldValue(field: FormField): any {
    if (field.type === 'radio') {
      const checked = this.container.querySelector(
        `input[name="${field.uuid}"]:checked`
      ) as HTMLInputElement;
      return checked?.value || '';
    }
    if (field.type === 'checkbox') {
      return Array.from(
        this.container.querySelectorAll(`input[data-field-uuid="${field.uuid}"]:checked`)
      ).map((el: any) => el.value);
    }
    if (field.type === 'rating') {
      return parseInt(
        (this.container.querySelector(`[data-field-uuid="${field.uuid}"]`) as HTMLElement)
          ?.dataset.value || '0'
      );
    }
    if (field.type === 'consent') {
      const cb = this.container.querySelector(
        `input[data-field-uuid="${field.uuid}"]`
      ) as HTMLInputElement;
      return cb?.checked ? 'true' : '';
    }
    if (field.type === 'file') {
      const input = this.container.querySelector(
        `[data-field-uuid="${field.uuid}"]`
      ) as HTMLInputElement;
      return input?.files?.length ? input.files : null;
    }
    const el = this.container.querySelector(
      `[data-field-uuid="${field.uuid}"]`
    ) as HTMLInputElement;
    return el?.value || '';
  }

  private collectAllData(): FormSubmitPayload {
    const allFields: FormField[] =
      this.schema.type === 'multi_step'
        ? (this.schema.steps as any[]).reduce(
            (acc: FormField[], step: any) => [...acc, ...(step.fields || [])],
            []
          )
        : this.schema.fields || [];

    const payload: FormSubmitPayload = {};
    allFields.forEach((field: FormField) => {
      const value = this.getFieldValue(field);
      if (value !== undefined && value !== null && value !== '') {
        payload[field.uuid] = value;
      }
    });
    return payload;
  }

  private async handleSubmit(btn: HTMLButtonElement): Promise<void> {
    if (!this.validateCurrentStep()) return;

    btn.disabled = true;
    btn.textContent = 'Gönderiliyor...';

    try {
      const data = this.collectAllData();
      const response = await this.client.submitForm(this.schema.slug, data);
      this.showSuccess(response);
      this.options.onSuccess?.(response);
    } catch (err) {
      btn.disabled = false;
      btn.textContent = this.schema.settings?.submit_button_text || 'Gönder';
      this.options.onError?.(err as Error);
      // Genel hata göster
      const generalError = document.createElement('div');
      generalError.className = 'vb-error';
      generalError.style.textAlign = 'center';
      generalError.style.display = 'block';
      generalError.textContent = 'Form gönderilemedi. Lütfen tekrar deneyin.';
      btn.parentElement?.after(generalError);
    }
  }

  private showSuccess(response: any): void {
    this.container.innerHTML = `
      <div class="vb-form">
        <div class="vb-success">
          <div class="vb-success-icon">✅</div>
          <div class="vb-success-title">${response.success_title || 'Teşekkürler!'}</div>
          <div class="vb-success-msg">${response.success_message || 'Formunuz başarıyla gönderildi.'}</div>
        </div>
        <div class="vb-badge">
          <svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="12" height="12" fill="none" stroke="#9ca3af">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <span style="font-size:0.7rem;color:#9ca3af">VeriBenim ile kişisel verileriniz koruma altında</span>
        </div>
      </div>
    `;
  }
}
