import { AdminLayout } from '@/layouts';

export default function Billing() {
  return (
    <AdminLayout>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Card title!</h2>
          <p>If a dog chews shoes whose shoes does he choose?</p>
          <div className="card-actions justify-end">
            <button type="button" className="btn btn-primary">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
