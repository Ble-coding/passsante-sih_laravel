<?php

namespace App\Repositories;

use App\Models\LiveConsultation;
use App\Models\LiveMeeting;
use App\Models\UserZoomCredential;
use App\Models\ZoomOAuth;
use Flash;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;
use Carbon\Carbon;

/**
 * Class ZoomRepository
 */
class ZoomRepository
{


        public function createZoomMeeting(array $data): array
        {
            try {
                // Retrieve Zoom credentials of the logged-in user
                $userZoomCredential = UserZoomCredential::where('user_id', Auth::id())->first();
                if (!$userZoomCredential) {
                    throw new \Exception('Zoom credentials not found for this user.');
                }

                $clientId = $userZoomCredential->zoom_api_key;
                $clientSecret = $userZoomCredential->zoom_api_secret;
                $accountId = $userZoomCredential->zoom_api_account;

                // Generate a new access token
                $token = $this->generateToken($clientId, $clientSecret, $accountId);

                // Perform POST request to create a Zoom meeting
                $response = Http::withHeaders([
                    'Authorization' => 'Bearer ' . $token,
                    'Content-Type' => 'application/json',
                ])->withOptions([
                    'verify' => storage_path('app/certs/cacert.pem'), // Ensure correct path
                ])->post("https://api.zoom.us/v2/users/me/meetings", [
                    'topic' => $data['consultation_title'],
                    'type' => 2, // Scheduled meeting
                    'start_time' => Carbon::parse($data['consultation_date'])->toIso8601String(),
                    'duration' => $data['consultation_duration_minutes'],
                    'agenda' => $data['description'] ?? null,
                    'password' => '123456',
                    'settings' => [
                        'host_video' => ($data['host_video'] == LiveConsultation::HOST_ENABLE),
                        'participant_video' => ($data['participant_video'] == LiveConsultation::CLIENT_ENABLE),
                        'waiting_room' => true,
                    ],
                ]);

                $responseData = json_decode($response->getBody()->getContents(), true);
                return $responseData;
            } catch (\Exception $e) {
                if ($e->getCode() == 401) {
                    // Handle token expiration
                    throw new \Exception(__('messages.new_change.already_in_use'));
                } else {
                    throw new \Exception($e->getMessage());
                }
            }
        }

        protected function generateToken(string $clientId, string $clientSecret, string $accountId): string
        {
            try {
                // Base64 encode credentials
                $base64String = base64_encode("{$clientId}:{$clientSecret}");

                // Perform POST request to obtain access token
                $responseToken = Http::withHeaders([
                    "Content-Type" => "application/x-www-form-urlencoded",
                    "Authorization" => "Basic {$base64String}",
                ])->withOptions([
                    'verify' => storage_path('app/certs/cacert.pem'), // Ensure correct path
                ])->post("https://zoom.us/oauth/token?grant_type=account_credentials&account_id={$accountId}");

                if ($responseToken->successful()) {
                    $responseData = $responseToken->json();
                    if (isset($responseData['access_token'])) {
                        return $responseData['access_token'];
                    } else {
                        throw new \Exception("Access token not found in the response");
                    }
                } else {
                    throw new \Exception("Failed to fetch access token. Status: " . $responseToken->status() . ", Response: " . $responseToken->body());
                }
            } catch (\Throwable $th) {
                throw new \Exception("Error generating token: " . $th->getMessage());
            }
        }

        public function getToken(): string
        {
            try {
                // Retrieve Zoom credentials of the logged-in user
                $userZoomCredential = UserZoomCredential::where('user_id', Auth::id())->first();
                if (!$userZoomCredential) {
                    throw new \Exception('Zoom credentials not found for this user.');
                }

                $clientId = $userZoomCredential->zoom_api_key;
                $clientSecret = $userZoomCredential->zoom_api_secret;
                $accountId = $userZoomCredential->zoom_api_account;

                // Generate and return the access token
                return $this->generateToken($clientId, $clientSecret, $accountId);
            } catch (\Exception $e) {
                throw new \Exception("Error retrieving Zoom access token: " . $e->getMessage());
            }
        }

        public function connectWithZoom(UserZoomCredential $userZoomCredential): void
        {
            try {
                $clientId = $userZoomCredential->zoom_api_key;
                $clientSecret = $userZoomCredential->zoom_api_secret;
                $accountId = $userZoomCredential->zoom_api_account;

                // Generate a new access token
                $token = $this->generateToken($clientId, $clientSecret, $accountId);

                // Save or use the token as needed
                // For example, you could store it in session or persist it for future API requests.
            } catch (\Exception $e) {
                throw new \Exception("Error connecting with Zoom: " . $e->getMessage());
            }
        }




    // public function updateZoomMeeting(string $meetingId, array $data): array
    // {
    //     // Récupérer les informations d'identification Zoom de l'utilisateur connecté
    //     $userZoomCredential = \App\Models\UserZoomCredential::where('user_id', Auth::id())->first();
    //     $clientId = $userZoomCredential->zoom_api_key;
    //     $clientSecret = $userZoomCredential->zoom_api_secret;
    //     $accountId = $userZoomCredential->zoom_api_account;

    //     try {
    //         $token = $this->generateToken($clientId, $clientSecret, $accountId);

    //         $response = Http::withHeaders([
    //             'Authorization' => 'Bearer ' . $token,
    //             'Content-Type' => 'application/json',
    //         ])
    //         ->withOptions([
    //             'verify' => storage_path('app/certs/cacert.pem'), // Assurez-vous que ce chemin est correct
    //         ])
    //         ->patch("https://api.zoom.us/v2/meetings/{$meetingId}", [
    //             'topic' => $data['title'],
    //             'start_time' => Carbon::parse($data['start_date_time'])->toIso8601String(),
    //             'duration' => $data['duration_in_minute'],
    //         ]);

    //         if ($response->successful()) {
    //             return $response->json();
    //         } else {
    //             throw new \Exception("Failed to update meeting. Status: " . $response->status() . ", Response: " . $response->body());
    //         }
    //     } catch (\Throwable $th) {
    //         // Capture de l'exception et retour d'un tableau vide ou un tableau d'erreur
    //         // Vous pouvez ajuster selon les besoins de votre application
    //         return ['error' => $th->getMessage()];
    //     }
    // }


    public function updateZoomMeeting(string $meetingId, array $data): bool
    {
        try {
            // Retrieve Zoom credentials of the logged-in user
            $userZoomCredential = UserZoomCredential::where('user_id', auth()->id())->first();
            if (!$userZoomCredential) {
                throw new \Exception('Zoom credentials not found for this user.');
            }

            $clientId = $userZoomCredential->zoom_api_key;
            $clientSecret = $userZoomCredential->zoom_api_secret;
            $accountId = $userZoomCredential->zoom_api_account;

            // Generate a new access token
            $token = $this->generateToken($clientId, $clientSecret, $accountId);

            // Perform PATCH request to update a Zoom meeting
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $token,
                'Content-Type' => 'application/json',
            ])->withOptions([
                'verify' => storage_path('app/certs/cacert.pem'), // Ensure correct path
            ])->patch("https://api.zoom.us/v2/meetings/{$meetingId}", [
                'topic' => $data['consultation_title'],
                'start_time' => Carbon::parse($data['consultation_date'])->toIso8601String(),
                'duration' => $data['consultation_duration_minutes'],
                'agenda' => $data['description'] ?? null,
                'settings' => [
                    'host_video' => ($data['host_video'] == LiveConsultation::HOST_ENABLE),
                    'participant_video' => ($data['participant_video'] == LiveConsultation::CLIENT_ENABLE),
                    'waiting_room' => true,
                ],
            ]);

            if ($response->successful()) {
                return true;
            } else {
                throw new \Exception("Failed to update meeting. Status: " . $response->status() . ", Response: " . $response->body());
            }
        } catch (\Throwable $th) {
            throw new \Exception("Error updating Zoom meeting: " . $th->getMessage());
        }
    }





    protected function toZoomTimeFormat(string $dateTime): string
    {
        return Carbon::parse($dateTime)->toIso8601String();
    }


    public function zoomGet(string $url): array
    {
        try {
            $userZoomCredential = UserZoomCredential::where('user_id', Auth::id())->first();

            // Vérifie si l'utilisateur connecté est un médecin
            if ($userZoomCredential->hasRole('doctor')) {
                // Récupère les informations d'identification du médecin depuis la base de données
                $clientId = $userZoomCredential->zoom_api_key;
                $clientSecret = $userZoomCredential->zoom_api_secret;
                $accountId = $userZoomCredential->zoom_api_account;

                // Génère le token d'accès avec les informations d'identification du médecin
                $token = $this->generateToken($clientId, $clientSecret, $accountId);

                // Effectue la requête à Zoom avec le token d'accès
                $response = Http::withHeaders([
                    'Authorization' => 'Bearer ' . $token,
                ])->withOptions([
                    'verify' => storage_path('app/certs/cacert.pem'), // Assurez-vous que ce chemin est correct
                ])->get($url);
            } else {
                // Si l'utilisateur n'est pas un médecin, effectue simplement la requête sans token
                $response = Http::get($url);
            }

            // Retourne la réponse sous forme de tableau
            return $response->json();
        } catch (\Exception $e) {
            // Gère les erreurs éventuelles
            return ['error' => $e->getMessage()];
        }
    }


    public function destroyZoomMeeting(int $meetingId): bool
    {
        try {
            // Récupérer les informations d'identification Zoom de l'utilisateur connecté
            $userZoomCredential = \App\Models\UserZoomCredential::where('user_id', Auth::id())->first();
            $clientId = $userZoomCredential->zoom_api_key;
            $clientSecret = $userZoomCredential->zoom_api_secret;
            $accountId = $userZoomCredential->zoom_api_account;

            $token = $this->generateToken($clientId, $clientSecret, $accountId);

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $token,
            ])
            ->withOptions([
                'verify' => storage_path('app/certs/cacert.pem'), // chemin vers le fichier de certificat
            ])
            ->delete("https://api.zoom.us/v2/meetings/{$meetingId}");

            if ($response->successful()) {
                return true;
            } else {
                throw new \Exception("Failed to delete meeting. Status: " . $response->status() . ", Response: " . $response->body());
            }
        } catch (\Throwable $th) {
            throw new \Exception("Error deleting meeting: " . $th->getMessage());
        }
    }

}
