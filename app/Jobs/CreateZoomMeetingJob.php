<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Repositories\ZoomRepository;
use Exception;

class CreateZoomMeetingJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $data;

    /**
     * Create a new job instance.
     */
    public function __construct($data)
    {
        $this->data = $data;
    }

    /**
     * Execute the job.
     */
    public function handle(ZoomRepository $zoomRepository): void
    {
        try {
            $zoomRepository->createZoomMeeting($this->data);
        } catch (Exception $e) {
            // Gérer l'exception
            // Vous pouvez enregistrer l'erreur dans les logs pour l'inspection
            \Log::error('Erreur lors de la création de la réunion Zoom : ' . $e->getMessage());
        }
    }
}

