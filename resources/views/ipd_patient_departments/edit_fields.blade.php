<div class="row gx-10 mb-5">
    <div class="col-lg-3 col-md-6 col-sm-12">
        {{ Form::hidden('is_discharge',null)}}
        <div class="mb-5">
            <div class="mb-5">
                {{ Form::label('patient_id',__('messages.ipd_patient.patient_id').':', ['class' => 'form-label']) }}
                <span class="required"></span>
                {{ Form::select('patient_id', $data['patients'], null, ['class' => 'form-select ipdPatientId', 'required', 'id' => 'editIpdPatientId', 'placeholder' => __("messages.user.select_patient_name"), 'data-control' => 'select2', ($ipdPatientDepartment->is_discharge == true) ? 'disabled' : '']) }}
            </div>
        </div>
    </div>
    <div class="col-lg-3 col-md-6 col-sm-12">
        <div class="mb-5">
            <div class="mb-5">
                {{ Form::label('case_id', __('messages.ipd_patient.case_id').':', ['class' => 'form-label']) }}
                <span class="required"></span>
                @if ($ipdPatientDepartment->is_discharge == true)
                {{ Form::select('case_id', $data['case_id'], $ipdPatientDepartment->case_id, ['class' => 'form-select editIpdDepartmentCaseId', 'required', 'data-control' => 'select2', 'placeholder' => __('messages.ipd_patient.choose_case'), ($ipdPatientDepartment->is_discharge == true) ? 'disabled' : '']) }}
                @else
                    {{ Form::select('case_id', [null], null, ['class' => 'form-select editIpdDepartmentCaseId', 'required', 'id' => 'editIpdDepartmentCaseId', 'disabled', 'data-control' => 'select2', 'placeholder' => __('messages.ipd_patient.choose_case')]) }}
                @endif
            </div>
        </div>
    </div>
    <div class="col-lg-3 col-md-6 col-sm-12">
        <div class="mb-5">
            <div class="mb-5">
                {{ Form::label('ipd_number', __('messages.ipd_patient.ipd_number').':', ['class' => 'form-label']) }}
                {{ Form::text('ipd_number', null, ['class' => 'form-control', 'readonly']) }}
            </div>
        </div>
    </div>
    <div class="col-lg-3 col-md-6 col-sm-12">
        <div class="mb-5">
            <div class="mb-5">
                {{ Form::label('height', __('messages.ipd_patient.height').':', ['class' => 'form-label']) }}
                {{ Form::number('height', null, ['class' => 'form-control ipdDepartmentFloatNumber', 'max' => '7', 'step' => '.01']) }}
            </div>
        </div>
    </div>
    <div class="col-lg-3 col-md-6 col-sm-12">
        <div class="mb-5">
            <div class="mb-5">
                {{ Form::label('weight', __('messages.ipd_patient.weight').':', ['class' => 'form-label']) }}
                {{ Form::number('weight', null, ['class' => 'form-control ipdDepartmentFloatNumber', 'data-mask'=>'##0,00', 'max' => '200', 'step' => '.01', 'tabindex' => '3']) }}
            </div>
        </div>
    </div>
    <div class="col-lg-3 col-md-6 col-sm-12">
        <div class="mb-5">
            <div class="mb-5">
                {{ Form::label('bp', __('messages.ipd_patient.bp').':', ['class' => 'form-label']) }}
                {{ Form::text('bp', null, ['class' => 'form-control', 'tabindex' => '4']) }}
            </div>
        </div>
    </div>
    <div class="col-lg-3 col-md-6 col-sm-12">
        <div class="mb-5">
            <div class="mb-5">
                {{ Form::label('admission_date', __('messages.ipd_patient.admission_date').':', ['class' => 'form-label']) }}
                <span class="required"></span>
                {{ Form::text('admission_date', null, [ 'class' => (getLoggedInUser()->theme_mode) ? 'form-control bg-light ipdAdmissionDate' : 'form-control bg-white ipdAdmissionDate','id' => 'editIpdAdmissionDate','autocomplete' => 'off', 'required', 'tabindex' => '5']) }}
            </div>
        </div>
    </div>
    <div class="col-lg-3 col-md-6 col-sm-12">
        <div class="mb-5">
            <div class="mb-5">
                {{ Form::label('doctor_id',__('messages.ipd_patient.doctor_id').':', ['class' => 'form-label']) }}
                <span class="required"></span>
                {{ Form::select('doctor_id', $data['doctors'], null, ['class' => 'form-select', 'required', 'id' => 'editIpdDoctorId', 'placeholder' =>  __('messages.web_home.select_doctor'), 'data-control' => 'select2', 'tabindex' => '6']) }}
            </div>
        </div>
    </div>
    <div class="col-lg-3 col-md-6 col-sm-12">
        <div class="mb-5">
            <div class="mb-5">
                {{ Form::label('bed_type_id',__('messages.ipd_patient.bed_type_id').':', ['class' => 'form-label']) }}
                <span class="required"></span>
                {{ Form::select('bed_type_id', $data['bedTypes'], null, ['class' => 'form-select ipdBedTypeId', 'required', 'id' => 'editIpdBedTypeId', 'placeholder' => __('messages.bed.select_bed_type'), 'data-control' => 'select2', 'tabindex' => '7', ($ipdPatientDepartment->is_discharge == true) ? 'disabled' : '']) }}
            </div>
        </div>
    </div>
    <div class="col-lg-3 col-md-6 col-sm-12">
        <div class="mb-5">
            <div class="mb-5">
                {{ Form::label('bed_id',__('messages.ipd_patient.bed_id').':', ['class' => 'form-label']) }}
                <span class="required"></span>
                @if ($ipdPatientDepartment->is_discharge == true)
                    {{ Form::select('bed_id', $data['bed'],$ipdPatientDepartment->bed_id, ['class' => 'form-select', 'required', 'data-control' => 'select2', 'placeholder' => __('messages.bed.bed_id'), ($ipdPatientDepartment->is_discharge == true) ? 'disabled' : '']) }}
                @else
                    {{ Form::select('bed_id', [null], null, ['class' => 'form-select', 'required', 'id' => 'editIpdBedId', 'disabled', 'data-control' => 'select2', 'placeholder' => __('messages.bed.bed_id')]) }}
                @endif
            </div>
        </div>
    </div>
    <div class="col-lg-3 col-md-6 col-sm-12">
        <div class="mb-5">
            <div class="mb-5">
                {{ Form::label('is_old_patient',__('messages.ipd_patient.is_old_patient').':', ['class' => 'form-label']) }}
                <div class="form-check form-switch">
                    <input class="form-check-input" name="is_old_patient" type="checkbox" value="1"
                           id="flexSwitchDefault" {{ ($ipdPatientDepartment->is_old_patient) ? 'checked' : '' }}>
                </div>
            </div>
        </div>
    </div>
    <div class="col-md-12">
        <div class="mb-5">
            <div class="mb-5">
                {{ Form::label('symptoms',__('messages.ipd_patient.symptoms').':', ['class' => 'form-label']) }}
                {{ Form::textarea('symptoms', null, ['class' => 'form-control', 'rows' => 4]) }}
            </div>
        </div>
    </div>
    <div class="col-md-12">
        <div class="mb-5">
            <div class="mb-5">
                {{ Form::label('notes',__('messages.ipd_patient.notes').':', ['class' => 'form-label']) }}
                {{ Form::textarea('notes', null, ['class' => 'form-control', 'rows' => 4]) }}
            </div>
        </div>
    </div>
</div>
<div class="d-flex justify-content-end">
    {{ Form::submit(__('messages.common.save'), ['class' => 'btn btn-primary me-2', 'id' => 'btnIpdPatientEdit']) }}
    <a href="{{ route('ipd.patient.index') }}"
       class="btn btn-secondary">{{ __('messages.common.cancel') }}</a>
</div>
