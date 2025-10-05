<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class InjectTableToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->session()->get('table_token');

        // kalau akses /customer tanpa query token, redirect biar konsisten
        if ($request->is('customer') && $token && !$request->has('token')) {
            return redirect()->to('/customer?token=' . $token);
        }

        return $next($request);
    }
}
