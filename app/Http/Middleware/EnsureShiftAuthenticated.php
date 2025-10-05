<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureShiftAuthenticated
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Kalau route yang diakses login/logout, lewatin aja
        if ($request->routeIs('pos.login') || $request->routeIs('pos.login.submit')) {
            return $next($request);
        }

        // Kalau belum ada shift_auth di session, redirect ke login
        if (!$request->session()->has('shift_auth')) {
            return redirect()->route('pos.login');
        }

        return $next($request);
    }
}
