import { Product } from '@/lib/db'
import { Button } from '@/components/ui/button'

type PaymentPlan = '1' | '36' | '48'

interface OrderItem {
  id: string;
  name: string;
  productId: string;
  quantity: number;
  branchIndex: number;
}

interface ContractTablesProps {
  items: OrderItem[];
  products: Product[];
  paymentPlan: PaymentPlan;
  onClose: () => void;
}

export function ContractTables({ items, products, paymentPlan, onClose }: ContractTablesProps) {
  const getProductPrice = (product: Product, plan: PaymentPlan) => {
    switch (plan) {
      case '36':
        return product.Price36?.toString() || product.Price?.toString() || '0';
      case '48':
        return product.Price48?.toString() || product.Price?.toString() || '0';
      default:
        return product.Price?.toString() || '0';
    }
  };
  const tables = {
    OTC: items.filter(item => {
      const product = products.find(p => p.Name === item.productId);
      return product?.["Product Category"] === "OTC";
    }),
    Service: items.filter(item => {
      const product = products.find(p => p.Name === item.productId);
      return product?.["Product Category"] === "Service";
    }),
    OneTime: items.filter(item => {
      const product = products.find(p => p.Name === item.productId);
      return product?.["Product Category"] === "One time";
    })
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto p-6">
        <h2 className="text-2xl font-bold mb-4">טבלאות חוזה</h2>
        
        {Object.entries(tables).map(([category, categoryItems]) => 
          categoryItems.length > 0 && (
            <div key={category} className="mb-8">
              <h3 className="text-xl font-semibold mb-2">{category}</h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-right">מוצר</th>
                    <th className="border p-2">כמות</th>
                    <th className="border p-2">מחיר ליחידה</th>
                    <th className="border p-2">סה"כ</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryItems.map((item, index) => {
                    const product = products.find(p => p.Name === item.productId);
                    const price = product ? parseFloat(getProductPrice(product, paymentPlan)) : 0;
                    const total = price * item.quantity;
                    
                    return (
                      <tr key={index}>
                        <td className="border p-2">{product?.Name}</td>
                        <td className="border p-2 text-center">{item.quantity}</td>
                        <td className="border p-2 text-center">₪{price.toFixed(2)}</td>
                        <td className="border p-2 text-center">₪{total.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                  <tr className="font-bold">
                    <td colSpan={3} className="border p-2 text-left">סה"כ</td>
                    <td className="border p-2 text-center">
                      ₪{categoryItems.reduce((sum, item) => {
                        const product = products.find(p => p.Name === item.productId);
                        const price = product ? parseFloat(getProductPrice(product, paymentPlan)) : 0;
                        return sum + (price * item.quantity);
                      }, 0).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )
        )}
        
        <div className="mt-6 flex justify-end">
          <Button onClick={onClose}>סגור</Button>
        </div>
      </div>
    </div>
  );
} 