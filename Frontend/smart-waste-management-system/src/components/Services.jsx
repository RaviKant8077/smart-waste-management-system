export default function Services() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Our Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[color:var(--card)] p-4 rounded-md shadow">
          <h3 className="font-semibold">Smart Collection</h3>
          <p className="text-[color:var(--muted)]">Optimized routes using realtime fill-level data.</p>
        </div>
        <div className="bg-[color:var(--card)] p-4 rounded-md shadow">
          <h3 className="font-semibold">Complaint Management</h3>
          <p className="text-[color:var(--muted)]">Track and resolve citizen complaints quickly.</p>
        </div>
      </div>
    </div>
  )
}
