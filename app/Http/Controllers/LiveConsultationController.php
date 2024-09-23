<?php

namespace App\Http\Controllers;

use App;
use Illuminate\Support\Facades\Redirect;
use App\Http\Requests\CreateZoomCredentialRequest;
use App\Http\Requests\LiveConsultationRequest;
use App\Models\LiveConsultation;
use App\Models\UserZoomCredential;
use App\Repositories\LiveConsultationRepository;
use App\Repositories\PatientCaseRepository;
use App\Repositories\ZoomRepository;
use Exception;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App as FacadesApp;

/**
 * Class LiveConsultationController
 */
class LiveConsultationController extends AppBaseController
{
    /** @var LiveConsultationRepository */
    private $liveConsultationRepository;

    /** @var PatientCaseRepository */
    private $patientCaseRepository;

    /** @var ZoomRepository */
    private $zoomRepository;

    /**
     * LiveConsultationController constructor.
     */
    public function __construct(
        LiveConsultationRepository $liveConsultationRepository,
        PatientCaseRepository $patientCaseRepository,
        ZoomRepository $zoomRepository
    ) {
        $this->liveConsultationRepository = $liveConsultationRepository;
        $this->patientCaseRepository = $patientCaseRepository;
        $this->zoomRepository = $zoomRepository;
    }

    /**
     * Display a listing of the LabTechnician.
     *
     * @return Factory|View
     *
     * @throws Exception
     */
    public function index(Request $request): \Illuminate\View\View
    {
        $doctors = $this->patientCaseRepository->getDoctors();
        $patients = $this->patientCaseRepository->getPatients();
        $type = LiveConsultation::STATUS_TYPE;
        $status = LiveConsultation::status;

        return view('live_consultations.index', compact('doctors', 'patients', 'type', 'status'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(LiveConsultationRequest $request): JsonResponse
    {
        try {
            $this->liveConsultationRepository->store($request->all());
            $this->liveConsultationRepository->createNotification($request->all());

            return $this->sendSuccess(__('messages.flash.live_consultation_saved'));
        } catch (Exception $e) {
            return $this->sendError($e->getMessage());
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(LiveConsultation $liveConsultation): JsonResponse
    {
        if (!canAccessRecord(LiveConsultation::class, $liveConsultation->id)) {
            return $this->sendError(__('messages.flash.not_allow_access_record'));
        }

        return $this->sendResponse($liveConsultation, __('messages.flash.live_consultation_retrieved'));
    }


    /**
     * Update the specified resource in storage.
     */
    // public function update(LiveConsultationRequest $request, LiveConsultation $liveConsultation): JsonResponse
    // {
    //     try {
    //         $this->liveConsultationRepository->edit($request->all(), $liveConsultation);

    //         return $this->sendSuccess(__('messages.flash.live_consultation_updated'));
    //     } catch (Exception $e) {
    //         return $this->sendError($e->getMessage());
    //     }
    // }

    public function update(LiveConsultationRequest $request, LiveConsultation $liveConsultation, ZoomRepository $zoomRepository): JsonResponse
    {
        try {
            // Call repository method to update Zoom meeting
            $zoomRepository->updateZoomMeeting($liveConsultation->meeting_id, $request->all());

            // Optionally handle success response
            return $this->sendSuccess(__('messages.flash.live_consultation_updated'));
        } catch (Exception $e) {
            return $this->sendError($e->getMessage());
        }
    }



    /**
     * Remove the specified resource from storage.
     */


     public function destroy(LiveConsultation $liveConsultation)
     {
         if (!canAccessRecord(LiveConsultation::class, $liveConsultation->id)) {
             return $this->sendError(__('messages.flash.live_consultation_not_found'));
         }

         try {
             // Call repository method to destroy Zoom meeting
             $this->zoomRepository->destroyZoomMeeting($liveConsultation->meeting_id);

             // Delete LiveConsultation record
             $liveConsultation->delete();

             // Optionally handle success response
        //      return redirect()->route('live.consultation.index')->with('success', __('messages.flash.live_consultation_deleted'));
        //  } catch (\Exception $e) {
        //      return $this->sendError($e->getMessage());
        //  }
        return $this->sendSuccess(__('messages.flash.live_consultation_deleted'));
    } catch (Exception $e) {
        return $this->sendError($e->getMessage());
    }
     }



    // public function destroy(LiveConsultation $liveConsultation): JsonResponse
    // {
    //     try {
    //         $this->zoomRepository->destroyZoomMeeting($liveConsultation);

    //         // Supprimer la consultation en local après avoir réussi la suppression sur Zoom
    //         $liveConsultation->delete();

    //         return $this->sendSuccess(__('messages.flash.live_consultation_deleted'));
    //     } catch (ClientException $e) {
    //         // Si Zoom retourne une erreur 404 (Not Found)
    //         if ($e->getResponse()->getStatusCode() == 404) {
    //             return $this->sendError(__('messages.flash.live_consultation_not_found'));
    //         }

    //         // Si Zoom retourne une autre erreur client
    //         return $this->sendError($e->getMessage());
    //     } catch (\Exception $e) {
    //         // Gestion générale des exceptions
    //         return $this->sendError($e->getMessage());
    //     }
    // }


    /**
     * Display the specified resource.
     */
    public function getTypeNumber(Request $request): JsonResponse
    {
        try {
            $typeNumber = $this->liveConsultationRepository->getTypeNumber($request->all());

            return $this->sendResponse($typeNumber, 'Type Number Retrieved successfully.');
        } catch (Exception $e) {
            return $this->sendError($e->getMessage());
        }
    }

    public function getChangeStatus(Request $request): JsonResponse
    {
        $liveConsultation = LiveConsultation::findOrFail($request->get('id'));
        $status = null;

        if ($request->get('statusId') == LiveConsultation::STATUS_AWAITED) {
            $status = LiveConsultation::STATUS_AWAITED;
        } elseif ($request->get('statusId') == LiveConsultation::STATUS_CANCELLED) {
            $status = LiveConsultation::STATUS_CANCELLED;
        } else {
            $status = LiveConsultation::STATUS_FINISHED;
        }

        $liveConsultation->update([
            'status' => $status,
        ]);

        return $this->sendsuccess(__('messages.common.status_updated_successfully'));
    }

    // public function getLiveStatus(LiveConsultation $liveConsultation): JsonResponse
    // {
    //     $data['liveConsultation'] = LiveConsultation::with('user')->find($liveConsultation->id);
    //     /** @var ZoomRepository $zoomRepo */
    //     $zoomRepo = App::make(ZoomRepository::class, ['createdBy' => $liveConsultation->created_by]);

    //     $data['zoomLiveData'] = $zoomRepo->zoomGet($liveConsultation->meeting_id);

    //     return $this->sendResponse($data, __('messages.flash.live_status_retrieved'));
    // }

    public function getLiveStatus(LiveConsultation $liveConsultation)
    {
        try {
            $userZoomCredential = UserZoomCredential::where('user_id', getLoggedInUserId())->first();

            // Vérifie si l'utilisateur connecté a le rôle de patient ou de médecin
            if (!$userZoomCredential) {
                return $this->sendError(__('messages.common.not_allow__assess_record'));
            }

            // Charge les détails de la consultation en direct avec l'utilisateur associé
            $data['liveConsultation'] = LiveConsultation::with('user')->find($liveConsultation->id);

            // Instancie le repository Zoom
            $zoomRepo = app()->make(ZoomRepository::class);

            // Appelle la méthode pour récupérer les données Zoom
            $data['zoomLiveData'] = $zoomRepo->zoomGet($liveConsultation->meeting_id);

            // Retourne la réponse avec les données et un message de succès
            return $this->sendResponse($data, __('messages.live_status_retrieved'));
        } catch (\Exception $e) {
            // Gère les erreurs éventuelles
            return $this->sendError($e->getMessage());
        }
    }


    public function show(LiveConsultation $liveConsultation): JsonResponse
    {
        $data['liveConsultation'] = LiveConsultation::with([
            'user', 'patient.patientUser', 'doctor.doctorUser', 'opdPatient', 'ipdPatient',
        ])->find($liveConsultation->id);

        $data['typeNumber'] = ($liveConsultation->type == LiveConsultation::OPD) ? $liveConsultation->opdPatient->opd_number : $liveConsultation->ipdPatient->ipd_number;

        return $this->sendResponse($data, __('messages.flash.live_consultation_retrieved'));
    }

    public function zoomCredential(int $id): JsonResponse
    {
        try {
            $data = UserZoomCredential::where('user_id', $id)->first();

            return $this->sendResponse($data, __('messages.flash.user_zoom_credential_retrieved'));
        } catch (Exception $e) {
            return $this->sendError($e->getMessage());
        }
    }

    public function zoomCredentialCreate(CreateZoomCredentialRequest $request): JsonResponse
    {
        try {
            $userId = getLoggedInUserId();
            $credentials = [
                'user_id' => $userId,
                'zoom_api_key' => $request->zoom_api_key,
                'zoom_api_secret' => $request->zoom_api_secret,
                'zoom_api_account' => $request->zoom_api_account,
            ];

            $this->liveConsultationRepository->createUserZoom($credentials);

            return $this->sendSuccess(__('messages.flash.user_zoom_credential_saved'));
        } catch (Exception $e) {
            return $this->sendError($e->getMessage());
        }
    }




    public function zoomConnect(Request $request)
    {
        try {
            // Retrieve Zoom credentials of the logged-in user
            $userZoomCredential = UserZoomCredential::where('user_id', getLoggedInUserId())->first();

            if (!$userZoomCredential) {
                // Handle case where credentials are not found
                app()->setLocale(getLoggedInUser()->language);
                return redirect()->back()->withErrors(__('messages.new_change.add_credential'));
            }

            // Connect with Zoom using retrieved credentials
            $this->zoomRepository->connectWithZoom($userZoomCredential);

            return redirect()->route('live.consultation.index'); // Redirect to some success route
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function createMeeting(LiveConsultationRequest $request): JsonResponse
    {
        $data = $request->validated();

        try {
            // Dispatch the job to create a Zoom meeting asynchronously
            CreateZoomMeetingJob::dispatch($data);

            return response()->json(['message' => 'Meeting creation in progress'], 200);
        } catch (\Exception $e) {
            Log::error('Failed to dispatch CreateZoomMeetingJob: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to initiate meeting creation process'], 500);
        }
    }



    // public function zoomConnect(Request $request)
    // {
    //     $userZoomCredential = UserZoomCredential::where('user_id', getLoggedInUserId())->first();

    //     if ($userZoomCredential == null) {
    //         app()->setLocale(getLoggedInUser()->language);
    //         return redirect()->back()->withErrors(__('messages.new_change.add_credential'));
    //     }

    //     try {
    //         $this->zoomRepository->connectWithZoom();
    //         return redirect()->route('live.consultation.index');
    //     } catch (\Exception $e) {
    //         return response()->json(['error' => $e->getMessage()], 400);
    //     }
    // }




    public function zoomCallback(Request $request)
    {
        /** $zoomRepo Zoom */
        $zoomRepo = FacadesApp::make(ZoomRepository::class);
        $zoomRepo->connectWithZoom($request->get('code'));

        return redirect(route('live.consultation.index'));
    }






}
