import { Component, OnInit } from '@angular/core';
import { TranslationBaseComponent } from '../../../../@shared/language-base/translation-base.component';
import { TranslateService } from '@ngx-translate/core';
import {
	Invoice,
	CurrenciesEnum,
	Payment,
	PaymentMethodEnum,
	Organization
} from '@gauzy/models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { PaymentService } from '../../../../@core/services/payment.service';
import { Store } from '../../../../@core/services/store.service';

@Component({
	selector: 'ga-payment-add',
	templateUrl: './payment-mutation.component.html',
	styleUrls: ['./payment-mutation.component.scss']
})
export class PaymentMutationComponent extends TranslationBaseComponent
	implements OnInit {
	constructor(
		readonly translateService: TranslateService,
		private fb: FormBuilder,
		protected dialogRef: NbDialogRef<PaymentMutationComponent>,
		private paymentService: PaymentService,
		private store: Store,
		private toastrService: NbToastrService
	) {
		super(translateService);
	}

	invoice: Invoice;
	invoices: Invoice[];
	organization: Organization;
	payment: Payment;
	form: FormGroup;
	currencies = Object.values(CurrenciesEnum);
	paymentMethods = Object.values(PaymentMethodEnum);
	currencyString: string;
	get currency() {
		return this.form.get('currency');
	}

	ngOnInit() {
		this.initializeForm();
		if (this.currency && !this.currency.value) {
			if (this.invoice) {
				this.currency.setValue(this.invoice.currency);
			} else if (this.currencyString) {
				this.currency.setValue(this.currencyString);
			}
		}
		this.form.get('currency').disable();
	}

	initializeForm() {
		if (this.payment) {
			this.form = this.fb.group({
				amount: [
					this.payment.amount,
					Validators.compose([Validators.required, Validators.min(1)])
				],
				currency: [this.payment.currency, Validators.required],
				paymentDate: [
					new Date(this.payment.paymentDate),
					Validators.required
				],
				note: [this.payment.note, Validators.required],
				paymentMethod: [
					this.payment.paymentMethod,
					Validators.required
				],
				invoice: [this.payment.invoice]
			});
		} else {
			this.form = this.fb.group({
				amount: [
					'',
					Validators.compose([Validators.required, Validators.min(1)])
				],
				currency: ['', Validators.required],
				paymentDate: [new Date(), Validators.required],
				note: ['', Validators.required],
				paymentMethod: ['', Validators.required],
				invoice: []
			});
		}
	}

	async addEditPayment() {
		const paymentData = this.form.value;

		const payment = {
			amount: paymentData.amount,
			paymentDate: paymentData.paymentDate,
			note: paymentData.note,
			currency: this.currency.value,
			invoice: this.invoice ? this.invoice : paymentData.invoice,
			invoiceId: this.invoice
				? this.invoice.id
				: paymentData.invoice
				? paymentData.invoice.id
				: null,
			organization: this.invoice
				? this.invoice.fromOrganization
				: this.organization
				? this.organization
				: null,
			organizationId: this.invoice
				? this.invoice.organizationId
				: this.organization
				? this.organization.id
				: null,
			recordedBy: this.store.user,
			userId: this.store.userId,
			paymentMethod: paymentData.paymentMethod
		};

		if (this.invoice) {
			const overdue = this.compareDate(
				paymentData.paymentDate,
				this.invoice.dueDate
			);
			payment['overdue'] = overdue;
		} else if (paymentData.invoice) {
			const overdue = this.compareDate(
				paymentData.paymentDate,
				paymentData.invoice.dueDate
			);
			payment['overdue'] = overdue;
		}

		if (this.payment) {
			payment['id'] = this.payment.id;
		}

		this.toastrService.primary(
			this.getTranslation('INVOICES_PAGE.PAYMENTS.PAYMENT_ADD'),
			this.getTranslation('TOASTR.TITLE.SUCCESS')
		);
		this.dialogRef.close(payment);
	}

	compareDate(date1: any, date2: any) {
		const d1 = new Date(date1);
		const d2 = new Date(date2);

		const same = d1.getTime() === d2.getTime();

		if (same) {
			return false;
		}

		return d1 > d2;
	}

	cancel() {
		this.dialogRef.close();
	}
}
