<table>
    <thead>
        <tr>
            <th>ID Transaksi</th>
            <th>Tanggal</th>
            <th>Customer</th>
            <th>Metode Pembayaran</th>
            <th>Total</th>
            <th>Status</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($orders as $o)
            <tr>
                <td>{{ $o->id }}</td>
                <td>{{ $o->created_at }}</td>
                <td>{{ $o->user->name ?? 'Guest' }}</td>
                <td>{{ $o->payment_method }}</td>
                <td>{{ $o->total_amount }}</td>
                <td>{{ $o->status }}</td>
            </tr>
        @endforeach
    </tbody>
</table>
