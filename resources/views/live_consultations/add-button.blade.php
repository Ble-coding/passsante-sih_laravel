@if(!Auth::user()->hasRole('Patient'))
    <div class="dropdown">
        <a href="#" class="btn btn-primary dropdown-toggle me-5" id="dropdownMenuButton"
           data-bs-toggle="dropdown"
           aria-haspopup="true" aria-expanded="false">{{ __('messages.common.actions') }}
        </a>
        <ul class="dropdown-menu action-dropdown" aria-labelledby="dropdownMenuButton">
            <li>
                <a href="#" data-bs-toggle="modal" data-bs-target="#add_consulatation_modal"
                   class="dropdown-item  px-5"> {{ __('messages.live_consultation.new_live_consultation') }}
                </a>
            </li>
            <li>
                <a href="javascript:void(0)" class="dropdown-item px-5 add-credential">
                    {{ __('messages.live_consultation.add_credential') }}
                </a>
            </li>
        </ul>
    </div>
    @if(isZoomTokenExpire())
        <a type="button" class="btn btn-success mr-5 ml-5"  href="{{ route('zoom.connect') }}">
            {{ __('messages.medicine_bills.connect_with_zoom') }}
        </a>
    @endif

    {{-- @if(isZoomTokenExpire())
        <a type="button" class="btn btn-success mr-5 ml-5" target="_blank" href="{{route('zoom.connect')}}"> --}}
        {{-- <a type="button" class="btn btn-success mr-5 ml-5" href="{{route('zoom.connect')}}"> --}}
            {{-- {{ __('messages.medicine_bills.connect_with_zoom') }} --}}
        {{-- </a>
    @endif --}}
    {{-- <a type="button" class="btn btn-success mr-5 ml-5" target="_blank" href="{{ route('zoom.createMeeting') }}">
        {{ __('messages.medicine_bills.connect_with_zoom') }}
    </a> --}}

    {{-- <form action="{{ route('zoom.createMeeting') }}" method="POST">
        @csrf
        <!-- Ajoutez ici d'autres champs nécessaires pour la création de la réunion -->
        <button type="submit" class="btn btn-success mr-5 ml-5">
            {{ __('messages.medicine_bills.connect_with_zoom') }}
        </button>
    </form> --}}


@endif
