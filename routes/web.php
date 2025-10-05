<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Controllers Customer
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\OtpController;
use App\Http\Controllers\DashboardController as CustomerDashboardController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\CommunityController as CustomerCommunityController;

// Controllers POS
use App\Http\Controllers\Pos\DashboardController as PosDashboardController;
use App\Http\Controllers\Pos\AuthController as PosAuthController;
use App\Http\Controllers\Pos\TableMonitoringController as PosTableController;
use App\Http\Controllers\Pos\ReportingShiftController;

// Controllers Admin
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\MenuItemController;
use App\Http\Controllers\Admin\TableController;
use App\Http\Controllers\Admin\CommunityController as AdminCommunityController;
use App\Http\Controllers\Admin\CommunityMemberController as AdminCommunityMemberController;
use App\Http\Controllers\Admin\CommunityTransactionController as AdminCommunityTransactionController;
use App\Http\Controllers\Admin\CommunityRedemptionController as AdminCommunityRedemptionController;
use App\Http\Controllers\Admin\ShiftAccountController;
use App\Http\Controllers\Admin\AuthController as AdminAuthController;

// Landing page
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

/*
|--------------------------------------------------------------------------
| Customer Routes
|--------------------------------------------------------------------------
*/

// Customer Dashboard (Guest & Auth)
Route::middleware(['inject.token'])->group(function () {
    Route::get('/customer', [CustomerDashboardController::class, 'index'])->name('customer.dashboard');
});

// Authenticated Customer Routes (pakai guard default 'web')
Route::middleware(['auth:web'])->prefix('customer')->group(function () {
    // Profile
    Route::get('/profile', [ProfileController::class, 'index'])->name('customer.profile.index');
    Route::put('/profile', [ProfileController::class, 'update'])->name('customer.profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('customer.profile.destroy');

    // Orders
    Route::get('/orders/history', [OrderController::class, 'history'])->name('customer.orders.history');
    Route::get('/orders/{id}', [OrderController::class, 'show'])->name('customer.orders.show');
    Route::post('/orders/{id}/repeat', [CartController::class, 'repeatOrder'])->name('customer.orders.repeat');

    // My Communities
    Route::get('/communities', [CustomerCommunityController::class, 'index'])
        ->name('customer.communities.index');
    Route::get('/communities/apply', [CustomerCommunityController::class, 'applyForm'])
        ->name('customer.communities.apply.form');
    Route::post('/communities/apply', [CustomerCommunityController::class, 'apply'])
        ->name('customer.communities.apply');
    Route::get('/communities/{community}', [CustomerCommunityController::class, 'show'])
        ->name('customer.communities.show');
    Route::post('/communities/join', [CustomerCommunityController::class, 'join'])
        ->name('customer.communities.join');

    // Menu
    Route::get('/menu/{id}', [MenuController::class, 'show'])->name('customer.menu.show');

    // Cart & Checkout
    Route::prefix('cart')->group(function () {
        Route::get('/', [CartController::class, 'index'])->name('customer.cart.index');
        Route::post('/', [CartController::class, 'store'])->name('customer.cart.store');
        Route::put('/{itemId}', [CartController::class, 'update'])->name('customer.cart.update');
        Route::delete('/{itemId}', [CartController::class, 'destroy'])->name('customer.cart.destroy');
        Route::delete('/', [CartController::class, 'clear'])->name('customer.cart.clear');
        Route::post('/checkout', [CartController::class, 'checkout'])->name('customer.cart.checkout');
    });

    // Orders Notifications & Summary
    Route::post('/orders/notification', [OrderController::class, 'notificationHandler'])->name('customer.orders.notification');
    Route::get('/orders/summary/{id}', [OrderController::class, 'summary'])->name('customer.orders.summary');
});

// OTP Auth Customer
Route::prefix('auth')->group(function () {
    Route::get('/otp/login', fn() => Inertia::render('Auth/OtpLogin'))->name('customer.otp.login');
    Route::post('/otp/send', [OtpController::class, 'sendOtp'])->name('customer.otp.send');
    Route::post('/otp/verify', [OtpController::class, 'verifyOtp'])->name('customer.otp.verify');
});

/*
|--------------------------------------------------------------------------
| POS Routes (pakai guard pos)
|--------------------------------------------------------------------------
*/
Route::prefix('pos')->name('pos.')->group(function () {
    // Login & Logout
    Route::get('login', [PosAuthController::class, 'showLoginForm'])->name('login');
    Route::post('login', [PosAuthController::class, 'login'])->name('login.submit');
    Route::post('logout', [PosAuthController::class, 'logout'])->name('logout');

    // Protected POS routes
    Route::middleware(['pos.auth'])->group(function () {
        Route::get('/', [PosDashboardController::class, 'index'])->name('dashboard');
        Route::post('/transaction/store', [PosDashboardController::class, 'storeTransaction'])->name('transaction.store');

        Route::get('/tables', [PosTableController::class, 'page'])->name('tables.page');
        Route::post('/tables/{id}/status', [PosTableController::class, 'updateStatus'])->name('tables.updateStatus');

        // Reporting Shift
        Route::get('/reporting-shift', [ReportingShiftController::class, 'index'])->name('reporting-shift.index');
        Route::post('/reporting-shift/close', [ReportingShiftController::class, 'closeShift'])->name('reporting-shift.close');
    });
});

/*
|--------------------------------------------------------------------------
| Admin Auth Routes
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('login', [AdminAuthController::class, 'showLoginForm'])->name('login');
    Route::post('login', [AdminAuthController::class, 'login'])->name('login.submit');
    Route::post('logout', [AdminAuthController::class, 'logout'])->name('logout');
});

/*
|--------------------------------------------------------------------------
| Admin Routes (pakai guard admin custom)
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->name('admin.')->middleware('admin.auth')->group(function () {
    // Dashboard
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    // Menu Items Management
    Route::resource('menu-items', MenuItemController::class);
    Route::post('/menu-items/{menuItem}/toggle-availability', [MenuItemController::class, 'toggleAvailability'])->name('menu-items.toggleAvailability');

    // Table Management
    Route::resource('tables', TableController::class);
    Route::post('/tables/{table}/regenerate', [TableController::class, 'regenerate'])->name('tables.regenerate');

    // Communities
    Route::resource('communities', AdminCommunityController::class);
    Route::post('communities/{community}/approve', [AdminCommunityController::class, 'approve'])->name('communities.approve');
    Route::post('communities/{community}/reject', [AdminCommunityController::class, 'reject'])->name('communities.reject');

    // Community Members
    Route::post('communities/{community}/members', [AdminCommunityMemberController::class, 'store'])->name('communities.members.store');
    Route::delete('communities/{community}/members/{member}', [AdminCommunityMemberController::class, 'destroy'])->name('communities.members.destroy');

    // Transactions
    Route::post('communities/{community}/transactions', [AdminCommunityTransactionController::class, 'store'])->name('communities.transactions.store');

    // Redemptions
    Route::post('communities/{community}/redemptions', [AdminCommunityRedemptionController::class, 'store'])->name('communities.redemptions.store');
    Route::put('communities/{community}/redemptions/{redemption}', [AdminCommunityRedemptionController::class, 'update'])->name('communities.redemptions.update');

    // Shift Accounts
    Route::resource('shift-accounts', ShiftAccountController::class);
});

require __DIR__.'/auth.php';
