'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Plus, Minus, Loader2 } from 'lucide-react'
import { getCompanies, getProducts, createCompany, createOrder, createOrderItem, createCompanyBranch, getCompanyBranches, type Company, type Product, type CompanyBranch } from "@/lib/db"
import { supabase } from "@/lib/supabase"
import { Header } from '@/components/Header'
import { CustomerSelect } from "@/components/customer-select"
import type { NewOrderData } from "@/lib/db"


interface Branch {
  id?: string; // UUID when created
  name: string;
  address: string;
}

interface NewCustomer {
  name: string;
  ltd: string;
  address: string;
  email: string;
  tel1: string;
  internetProvider: string;
  authName: string;
  authEmail: string;
  authMobile: string;
  authId: string;
  businessType: string;
  contactName: string;
  contactMobile: string;
  contactEmail: string;
  notes: string;
  isMultiBranch: boolean;
  branches: Branch[];
}

interface OrderItem {
  productId: string;
  quantity: number;
  id?: string; // Add unique identifier for React keys
}

interface ValidationErrors {
  [key: `branchName-${number}`]: string;
  [key: `branchAddress-${number}`]: string;
  [key: `product-${number}`]: string;
  [key: `quantity-${number}`]: string;
  customer?: string;
  name?: string;
  ltd?: string;
  address?: string;
  tel1?: string;
  email?: string;
  authName?: string;
  authMobile?: string;
  authEmail?: string;
  fetch?: string;
  submit?: string;
  general?: string;
}

type PaymentPlan = 'one-time' | '36' | '48';

export default function NewOrder() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [customers, setCustomers] = useState<Company[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState('')
  const [newCustomer, setNewCustomer] = useState<NewCustomer>({
    name: '',
    ltd: '',
    address: '',
    email: '',
    tel1: '',
    internetProvider: '',
    authName: '',
    authEmail: '',
    authMobile: '',
    authId: '',
    businessType: '',
    contactName: '',
    contactMobile: '',
    contactEmail: '',
    notes: '',
    isMultiBranch: false,
    branches: [{ name: '', address: '' }]
  })
  const [selectedBranch, setSelectedBranch] = useState(0)
  // Branch-specific order items: each branch has its own product list
  const [branchOrderItems, setBranchOrderItems] = useState<Record<number, OrderItem[]>>({})
  const [orderItems, setOrderItems] = useState<OrderItem[]>([{ 
    productId: '', 
    quantity: 1, 
    id: `item-${Date.now()}` 
  }])
  const [notes, setNotes] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [customerType, setCustomerType] = useState<'existing' | 'new'>('existing')
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [productSearch, setProductSearch] = useState("")
  const [paymentPlan, setPaymentPlan] = useState<PaymentPlan>('one-time')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const companiesData = await getCompanies()
        const productsData = await getProducts()
        setCustomers(companiesData)
        setProducts(productsData)
      } catch (error) {
        console.error('Error fetching data:', error)
        setErrors({ fetch: 'Failed to load customer and product data' })
      }
    }
    fetchData()
  }, [])

  const addBranch = () => {
    setNewCustomer({
      ...newCustomer,
      branches: [...newCustomer.branches, { name: '', address: '' }]
    })
  }

  const updateBranch = (index: number, field: keyof Branch, value: string) => {
    const updatedBranches = newCustomer.branches.map((branch, i) =>
      i === index ? { ...branch, [field]: value } : branch
    )
    setNewCustomer({ ...newCustomer, branches: updatedBranches })
  }

  const addOrderItem = () => {
    setOrderItems([...orderItems, { 
      productId: '', 
      quantity: 1, 
      id: `item-${Date.now()}-${Math.random()}` 
    }])
  }

  const removeOrderItem = (index: number) => {
    const newOrderItems = orderItems.filter((_, i) => i !== index)
    setOrderItems(newOrderItems)
  }

  const updateOrderItem = (index: number, field: keyof OrderItem, value: any) => {
    const newOrderItems = [...orderItems]
    newOrderItems[index] = {
      ...newOrderItems[index],
      [field]: value
    }
    setOrderItems(newOrderItems)
  }

  // Branch-specific order item functions
  const getCurrentBranchItems = () => {
    if (!newCustomer.isMultiBranch) return orderItems
    const items = branchOrderItems[selectedBranch] || [{ 
      productId: '', 
      quantity: 1, 
      id: `item-${Date.now()}` 
    }]
    console.log(`Getting items for branch ${selectedBranch}:`, items)
    return items
  }

  const updateBranchOrderItems = (branchIndex: number, items: OrderItem[]) => {
    console.log(`Updating branch ${branchIndex} with items:`, items)
    setBranchOrderItems(prev => {
      const newState = {
        ...prev,
        [branchIndex]: items
      }
      console.log('New branchOrderItems state:', newState)
      return newState
    })
  }

  const addBranchOrderItem = (branchIndex: number) => {
    const currentItems = branchOrderItems[branchIndex] || []
    const newItem = { 
      productId: '', 
      quantity: 1, 
      id: `item-${Date.now()}-${Math.random()}` 
    }
    updateBranchOrderItems(branchIndex, [...currentItems, newItem])
  }

  const removeBranchOrderItem = (branchIndex: number, itemIndex: number) => {
    const currentItems = branchOrderItems[branchIndex] || []
    const newItems = currentItems.filter((_, i) => i !== itemIndex)
    updateBranchOrderItems(branchIndex, newItems)
  }

  const updateBranchOrderItem = (branchIndex: number, itemIndex: number, field: keyof OrderItem, value: any) => {
    const currentItems = [...(branchOrderItems[branchIndex] || [])]
    if (currentItems[itemIndex]) {
      currentItems[itemIndex] = {
        ...currentItems[itemIndex],
        [field]: value
      }
      updateBranchOrderItems(branchIndex, currentItems)
    }
  }

  const validateStep = () => {
    const newErrors: ValidationErrors = {}
    if (step === 1) {
      if (!selectedCustomer && !newCustomer.name) {
        newErrors.customer = 'יש לבחור לקוח קיים או להזין פרטי לקוח חדש'
      }
      if (newCustomer.name) {
        if (!newCustomer.name) newErrors.name = 'יש להזין שם עסק'
        if (!newCustomer.ltd) newErrors.ltd = 'יש להזין ח.פ. או ע.מ'
        if (!newCustomer.address) newErrors.address = 'יש להזין כתובת'
        if (!newCustomer.tel1) newErrors.tel1 = 'יש להזין מספר טלפון'
        if (!newCustomer.email) newErrors.email = 'יש להזין כתובת אימייל'
        if (!newCustomer.authName) newErrors.authName = 'יש להזין שם מורשה חתימה'
        if (!newCustomer.authMobile) newErrors.authMobile = 'יש להזין נייד מורשה חתימה'
        if (!newCustomer.authEmail) newErrors.authEmail = 'יש להזין אימייל מורשה חתימה'
      }
    } else if (step === 2 && newCustomer.isMultiBranch) {
      newCustomer.branches.forEach((branch, index) => {
        if (!branch.name) newErrors[`branchName-${index}`] = 'יש להזין שם סניף'
        if (!branch.address) newErrors[`branchAddress-${index}`] = 'יש להזין כתובת סניף'
      })
    } else if (step === 3) {
      // Validate current branch items (for multi-branch) or regular order items (for single branch)
      const itemsToValidate = newCustomer.isMultiBranch ? getCurrentBranchItems() : orderItems
      itemsToValidate.forEach((item, index) => {
        if (!item.productId) newErrors[`product-${index}`] = 'יש לבחור מוצר'
        if (item.quantity < 1) newErrors[`quantity-${index}`] = 'הכמות חייבת להיות לפחות 1'
      })
      
      // For multi-branch, also validate that at least one branch has items
      if (newCustomer.isMultiBranch) {
        const hasAnyItems = Object.values(branchOrderItems).some(branchItems => 
          branchItems && branchItems.length > 0 && branchItems.some(item => item.productId)
        )
        if (!hasAnyItems) {
          newErrors.submit = 'יש להוסיף מוצרים לכל הסניפים'
        }
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (step === 1) {
      if (customerType === 'existing' && !selectedCompany) {
        setErrors({ customer: 'יש לבחור לקוח' })
        return
      }
      setErrors({})
      setStep(2)

      if (customerType === 'existing') {
        setStep(3)
      }
    } else if (step === 2) {
      setStep(3)
    }
  }

  const handlePrevStep = () => {
    setStep(step - 1)
  }

  const handleBack = () => {
    if (step === 3) {
      setStep(2);
    } else if (step === 2) {
      setStep(1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submit clicked');

    if (!validateStep()) {
      console.log('Validation failed');
      return;
    }

    // Check if products are selected (handle both single and multi-branch)
    const hasProducts = newCustomer.isMultiBranch 
      ? Object.values(branchOrderItems).some(branchItems => 
          branchItems && branchItems.length > 0 && branchItems.some(item => item.productId)
        )
      : orderItems.some(item => item.productId)
      
    if (!hasProducts) {
      console.log('No products selected');
      setErrors({ submit: 'יש לבחור מוצרים להזמנה' });
      return;
    }

    console.log('Starting order creation...');
    setIsLoading(true);
    try {
      let customerTaxId: string;
      let companyUUID = null;
      
      if (customerType === 'new') {
        customerTaxId = newCustomer.ltd; // Use the tax_id from the new customer form
        const createdCompany = await createCompany({
          "שם העסק": newCustomer.name,
          "ח.פ. או ע.מ": newCustomer.ltd,
          "כתובת מלאה": newCustomer.address,
          "מייל בית העסק": newCustomer.email,
          "טלפון": newCustomer.tel1,
          "ספק אינטרנט": newCustomer.internetProvider,
          "סוג עסק": newCustomer.businessType,
          "שם מורשה חתימה": newCustomer.authName,
          "נייד מורשה חתימה": newCustomer.authMobile,
          "מייל מורשה חתימה": newCustomer.authEmail,
          "שם איש קשר": newCustomer.contactName,
          "נייד איש קשר": newCustomer.contactMobile,
          "מייל איש קשר": newCustomer.contactEmail,
          "הערות": newCustomer.notes,
          "מרובה סניפים": newCustomer.isMultiBranch
        });
        
        if (createdCompany?.id) {
          companyUUID = createdCompany.id;
          
          // Create branches separately if multi-branch
          if (newCustomer.isMultiBranch && newCustomer.branches.length > 0) {
            const createdBranches: Branch[] = [];
            for (const branch of newCustomer.branches) {
              if (branch.name && branch.address) {
                const createdBranch = await createCompanyBranch({
                  company_id: createdCompany.id,
                  branch_name: branch.name,
                  address: branch.address
                });
                if (createdBranch) {
                  createdBranches.push({
                    id: createdBranch.id,
                    name: createdBranch.branch_name,
                    address: createdBranch.address
                  });
                }
              }
            }
            // Update newCustomer.branches with UUIDs
            setNewCustomer(prev => ({ ...prev, branches: createdBranches }));
          }
        }
      } else {
        // For existing customers, use the tax_id from selectedCompany
        customerTaxId = selectedCompany?.["ח.פ. או ע.מ"] as string;
      }

      const calculateTotals = (items: OrderItem[]) => {
        const totals = {
          OTC: 0,
          Service: 0,
          OneTime: 0
        };

        items.forEach(item => {
          const product = products.find(p => p.Name === item.productId);
          if (product) {
            const price = getProductPrice(product, paymentPlan);
            const total = price * item.quantity;

            switch (product["Product Category"]) {
              case "OTC":
                totals.OTC += total;
                break;
              case "Service":
                totals.Service += total;
                break;
              case "One time":
                totals.OneTime += total;
                break;
            }
          }
        });

        return totals;
      };

      // Create orders: per branch if multi-branch, else single order
      if (newCustomer.isMultiBranch) {
        // Multi-branch: create separate order for each branch
        for (const [branchIndexStr, items] of Object.entries(branchOrderItems)) {
          const branchIndex = parseInt(branchIndexStr);
          const branchItems = items.filter(item => item.productId); // Only items with products
          
          if (branchItems.length === 0) continue; // Skip empty branches
          
          // Get the actual branch UUID
          const branch = newCustomer.branches[branchIndex];
          const branchId = branch?.id || null;
          
          const order = await createOrder({
            customer_id: customerTaxId,
            branch_id: branchId,
            payment_plan: paymentPlan,
            total_amount: Object.values(calculateTotals(branchItems)).reduce((sum, val) => sum + val, 0),
            notes,
            status: 'new'
          } as NewOrderData);
          
          if (order && order.id) {
            for (const item of branchItems) {
              const product = products.find(p => p.Name === item.productId);
              if (!product) {
                console.error('Product not found:', item.productId);
                continue;
              }
              if (!product.id) {
                console.error('Product missing ID:', product);
                continue;
              }
              const price = getProductPrice(product, paymentPlan);
              console.log('Creating order item:', { order_id: order.id, product_id: product.id, quantity: item.quantity, unit_price: price });
              await createOrderItem({
                order_id: order.id,
                product_id: product.id,
                quantity: item.quantity,
                unit_price: price
              });
            }
          }
        }
      } else {
        // Single-branch: create one order
        const validItems = orderItems.filter(item => item.productId);
        
        if (validItems.length > 0) {
          const createdOrder = await createOrder({
            customer_id: customerTaxId,
            branch_id: null, // Single-branch companies don't have a specific branch
            payment_plan: paymentPlan,
            total_amount: Object.values(calculateTotals(validItems)).reduce((sum, val) => sum + val, 0),
            notes,
            status: 'new'
          } as NewOrderData);
          
          if (createdOrder && createdOrder.id) {
            for (const item of validItems) {
              const product = products.find(p => p.Name === item.productId);
              if (!product) {
                console.error('Product not found:', item.productId);
                continue;
              }
              if (!product.id) {
                console.error('Product missing ID:', product);
                continue;
              }
              const price = getProductPrice(product, paymentPlan);
              console.log('Creating order item:', { order_id: createdOrder.id, product_id: product.id, quantity: item.quantity, unit_price: price });
              await createOrderItem({
                order_id: createdOrder.id,
                product_id: product.id,
                quantity: item.quantity,
                unit_price: price
              });
            }
          }
        }
      }

      setShowConfirmation(true);
      setTimeout(() => {
        setShowConfirmation(false);
        router.push('/active-orders');
      }, 2000);
    } catch (error) {
      console.error('Error creating order:', error);
      setErrors({ submit: 'אירעה שגיאה ביצירת ההזמנה. אנא נסה שנית.' });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = (searchTerm: string) => {
    return products.filter(product =>
      product.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product["Product Type"]?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  const getProductPrice = (product: Product, plan: PaymentPlan): number => {
    switch (plan) {
      case '36':
        return product.Price36 ?? product.Price ?? 0;
      case '48':
        return product.Price48 ?? product.Price ?? 0;
      default:
        return product.Price ?? 0;
    }
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header title="הזמנה חדשה" backUrl="/" />
      <main className="container mx-auto p-4">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>יצירת הזמנה חדשה - שלב {step} מתוך 3</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <>
                  <div className="space-y-2">
                    <Label>בחר לקוח קיים או צור לקוח חדש</Label>
                    <RadioGroup
                      defaultValue="existing"
                      onValueChange={(value) => setCustomerType(value as 'existing' | 'new')}
                      className="mb-6"
                    >
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <RadioGroupItem value="existing" id="existing" />
                        <Label htmlFor="existing">לקוח קיים</Label>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <RadioGroupItem value="new" id="new" />
                        <Label htmlFor="new">לקוח חדש</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {customerType === 'existing' && (
                    <div className="space-y-4">
                      <CustomerSelect
                        onSelect={(company) => setSelectedCompany(company)}
                        onBranchUpdate={(branches) => setNewCustomer(prev => ({ ...prev, branches, isMultiBranch: true }))}
                        selectedCompany={selectedCompany}
                      />

                      {selectedCompany && (
                        <div className="p-4 border rounded-lg bg-muted">
                          <h3 className="font-semibold mb-2">פרטי לקוח:</h3>
                          <div className="space-y-1">
                            <p>שם: {selectedCompany["שם העסק"]}</p>
                            <p>ח.פ: {selectedCompany["ח.פ. או ע.מ"]}</p>
                            <p>כתובת: {selectedCompany["כתובת מלאה"]}</p>
                            <p>טלפון: {selectedCompany["טלפון"]}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {customerType === 'new' && (
                    <div className="space-y-4 p-4 border rounded-lg">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">שם העסק</Label>
                          <Input
                            id="name"
                            value={newCustomer.name}
                            onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                          />
                          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="ltd">ח.פ. או ע.מ</Label>
                          <Input
                            id="ltd"
                            value={newCustomer.ltd}
                            onChange={(e) => setNewCustomer({ ...newCustomer, ltd: e.target.value })}
                          />
                          {errors.ltd && <p className="text-red-500 text-sm">{errors.ltd}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="address">כתובת מלאה</Label>
                          <Input
                            id="address"
                            value={newCustomer.address}
                            onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                          />
                          {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="tel1">טלפון</Label>
                          <Input
                            id="tel1"
                            value={newCustomer.tel1}
                            onChange={(e) => setNewCustomer({ ...newCustomer, tel1: e.target.value })}
                          />
                          {errors.tel1 && <p className="text-red-500 text-sm">{errors.tel1}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">מייל בית העסק לחשבוניות</Label>
                          <Input
                            id="email"
                            type="email"
                            value={newCustomer.email}
                            onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                          />
                          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="internetProvider">ספק אינטרנט</Label>
                          <Select
                            onValueChange={(value) => setNewCustomer({ ...newCustomer, internetProvider: value })}
                          >
                            <SelectTrigger id="internetProvider">
                              <SelectValue placeholder="בחר ספק אינטרנט" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="HOT">HOT</SelectItem>
                              <SelectItem value="בזק">בזק</SelectItem>
                              <SelectItem value="פרטנר">פרטנר</SelectItem>
                              <SelectItem value="סלקום">סלקום</SelectItem>
                              <SelectItem value="אחר">אחר</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="businessType">סוג עסק</Label>
                          <Select
                            onValueChange={(value) => setNewCustomer({ ...newCustomer, businessType: value })}
                          >
                            <SelectTrigger id="businessType">
                              <SelectValue placeholder="בחר סוג עסק" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="עוסק מורשה">עוסק מורשה</SelectItem>
                              <SelectItem value="חברה בע״מ">חברה בע״מ</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center space-x-2 space-x-reverse">
                          <Switch
                            id="isMultiBranch"
                            checked={newCustomer.isMultiBranch}
                            onCheckedChange={(checked) => setNewCustomer({ ...newCustomer, isMultiBranch: checked })}
                          />
                          <Label htmlFor="isMultiBranch">לקוח מרובה סניפים</Label>
                        </div>

                        {newCustomer.isMultiBranch && (
                          <div className="space-y-4 border p-4 rounded">
                            <h3 className="font-semibold">סניפים</h3>
                            {newCustomer.branches.map((branch, index) => (
                              <div key={`branch-${index}`} className="space-y-2">
                                <Label>סניף {index + 1}</Label>
                                <Input
                                  placeholder="שם הסניף"
                                  value={branch.name}
                                  onChange={(e) => {
                                    const updatedBranches = [...newCustomer.branches];
                                    updatedBranches[index].name = e.target.value;
                                    setNewCustomer({ ...newCustomer, branches: updatedBranches });
                                  }}
                                />
                                <Input
                                  placeholder="כתובת הסניף"
                                  value={branch.address}
                                  onChange={(e) => {
                                    const updatedBranches = [...newCustomer.branches];
                                    updatedBranches[index].address = e.target.value;
                                    setNewCustomer({ ...newCustomer, branches: updatedBranches });
                                  }}
                                />
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setNewCustomer({
                                ...newCustomer,
                                branches: [...newCustomer.branches, { name: '', address: '' }]
                              })}
                            >
                              הוסף סניף
                            </Button>
                          </div>
                        )}

                        <div className="border-t pt-4">
                          <h3 className="font-semibold mb-4">פרטי מורשה חתימה</h3>
                          <div className="grid gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="authName">שם מלא</Label>
                              <Input
                                id="authName"
                                value={newCustomer.authName}
                                onChange={(e) => setNewCustomer({ ...newCustomer, authName: e.target.value })}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="authMobile">נייד</Label>
                              <Input
                                id="authMobile"
                                value={newCustomer.authMobile}
                                onChange={(e) => setNewCustomer({ ...newCustomer, authMobile: e.target.value })}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="authEmail">מייל</Label>
                              <Input
                                id="authEmail"
                                type="email"
                                value={newCustomer.authEmail}
                                onChange={(e) => setNewCustomer({ ...newCustomer, authEmail: e.target.value })}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="border-t pt-4">
                          <h3 className="font-semibold mb-4">פרטי איש קשר</h3>
                          <div className="grid gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="contactName">שם מלא</Label>
                              <Input
                                id="contactName"
                                value={newCustomer.contactName}
                                onChange={(e) => setNewCustomer({ ...newCustomer, contactName: e.target.value })}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="contactMobile">נייד</Label>
                              <Input
                                id="contactMobile"
                                value={newCustomer.contactMobile}
                                onChange={(e) => setNewCustomer({ ...newCustomer, contactMobile: e.target.value })}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="contactEmail">מייל</Label>
                              <Input
                                id="contactEmail"
                                type="email"
                                value={newCustomer.contactEmail}
                                onChange={(e) => setNewCustomer({ ...newCustomer, contactEmail: e.target.value })}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {(customerType === 'existing' && selectedCompany) ||
                    (customerType === 'new' && newCustomer.name) ? (
                    <div className="mt-6 space-y-2">
                      <Label>בחר תכנית תשלומים</Label>
                      <RadioGroup
                        value={paymentPlan}
                        onValueChange={(value) => setPaymentPlan(value as PaymentPlan)}
                        className="grid grid-cols-3 gap-4"
                      >
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="one-time" id="one-time" />
                          <Label htmlFor="one-time">תשלום אחד</Label>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="36" id="36-payments" />
                          <Label htmlFor="36-payments">36 תשלומים</Label>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="48" id="48-payments" />
                          <Label htmlFor="48-payments">48 תשלומים</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  ) : null}
                </>
              )}

              {step === 2 && newCustomer.isMultiBranch && (
                <>
                  <h3 className="text-lg font-semibold">פרטי סניפים</h3>
                  {newCustomer.branches.map((branch, index) => (
                    <div key={`step2-branch-${index}`} className="space-y-2 border p-4 rounded">
                      <Label htmlFor={`branchName-${index}`}>שם הסניף</Label>
                      <Input
                        id={`branchName-${index}`}
                        value={branch.name}
                        onChange={(e) => updateBranch(index, 'name', e.target.value)}
                      />
                      {errors[`branchName-${index}`] && <p className="text-red-500 text-sm">{errors[`branchName-${index}`]}</p>}

                      <Label htmlFor={`branchAddress-${index}`}>כתובת הסניף</Label>
                      <Input
                        id={`branchAddress-${index}`}
                        value={branch.address}
                        onChange={(e) => updateBranch(index, 'address', e.target.value)}
                      />
                      {errors[`branchAddress-${index}`] && <p className="text-red-500 text-sm">{errors[`branchAddress-${index}`]}</p>}
                    </div>
                  ))}
                  <Button type="button" onClick={addBranch}>
                    <Plus className="h-4 w-4 mr-2" /> הוסף סניף
                  </Button>
                </>
              )}

              {step === 3 && (
                <>
                  {newCustomer.isMultiBranch && (
                    <div className="space-y-2">
                      <Label htmlFor="branch">בחר סניף להתקנה</Label>
                      <Select 
                        value={selectedBranch.toString()} 
                        onValueChange={(value) => {
                          const branchIndex = parseInt(value)
                          console.log(`Switching to branch ${branchIndex}`)
                          console.log('Current branchOrderItems:', branchOrderItems)
                          setSelectedBranch(branchIndex)
                          // Initialize branch items if not exists
                          if (!branchOrderItems[branchIndex]) {
                            console.log(`Initializing branch ${branchIndex} with empty item`)
                            updateBranchOrderItems(branchIndex, [{ 
                              productId: '', 
                              quantity: 1, 
                              id: `item-${Date.now()}` 
                            }])
                          }
                        }}
                      >
                        <SelectTrigger id="branch">
                          <SelectValue placeholder="בחר סניף" />
                        </SelectTrigger>
                        <SelectContent>
                          {newCustomer.branches.map((branch, index) => (
                            <SelectItem key={`branch-select-${index}`} value={index.toString()}>
                              {branch.name || `סניף ${index + 1}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {getCurrentBranchItems().map((item, index) => (
                    <div key={item.id || `order-item-${index}`} className="space-y-4 p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={`product-${index}`} className="text-lg font-medium">
                          מוצר {index + 1}
                          {newCustomer.isMultiBranch && (
                            <span className="text-sm text-muted-foreground mr-2">
                              ({newCustomer.branches[selectedBranch]?.name || `סניף ${selectedBranch + 1}`})
                            </span>
                          )}
                        </Label>
                        {index > 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (newCustomer.isMultiBranch) {
                                removeBranchOrderItem(selectedBranch, index)
                              } else {
                                removeOrderItem(index)
                              }
                            }}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="flex flex-col md:flex-row gap-2">
                        <div className="flex-1">
                          <Select
                            onValueChange={(value) => {
                              if (newCustomer.isMultiBranch) {
                                updateBranchOrderItem(selectedBranch, index, 'productId', value)
                              } else {
                                updateOrderItem(index, 'productId', value)
                              }
                            }}
                            value={item.productId}
                          >
                            <SelectTrigger id={`product-${index}`} className="flex-1">
                              <SelectValue placeholder="בחר מוצר" />
                            </SelectTrigger>
                            <SelectContent className="w-[300px] md:w-[500px]">
                              <div className="p-2 border-b">
                                <Input
                                  placeholder="חיפוש מוצר..."
                                  value={productSearch}
                                  onChange={(e) => setProductSearch(e.target.value)}
                                  className="w-full"
                                />
                              </div>
                              <div className="max-h-[300px] overflow-y-auto">
                                {filteredProducts(productSearch).map((product, productIndex) => (
                                  <SelectItem
                                    key={`${product.id ?? product.Name}-${index}-${productIndex}`}
                                    value={product.Name}
                                    className="py-3"
                                  >
                                    <div className="flex flex-col w-full gap-1">
                                      <div className="flex justify-between items-start">
                                        <div className="flex-1 ml-4">
                                          <div className="font-medium truncate">{product.Name}</div>
                                          <div className="text-sm text-muted-foreground">
                                            {product["Product Type"]} | {product["Product Category"]}
                                          </div>
                                        </div>
                                        <div className="text-right whitespace-nowrap">
                                          <div className="font-medium">
                                            ₪{getProductPrice(product, paymentPlan)}
                                            {paymentPlan !== 'one-time' && product["Product Category"] === "OTC" && ` × ${paymentPlan}`}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </SelectItem>
                                ))}
                                {filteredProducts(productSearch).length === 0 && (
                                  <div className="p-4 text-center text-muted-foreground">
                                    לא נמצאו מוצרים
                                  </div>
                                )}
                              </div>
                            </SelectContent>
                          </Select>
                        </div>
                        <Input
                          type="number"
                          placeholder="כמות"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => {
                            const quantity = parseInt(e.target.value)
                            if (newCustomer.isMultiBranch) {
                              updateBranchOrderItem(selectedBranch, index, 'quantity', quantity)
                            } else {
                              updateOrderItem(index, 'quantity', quantity)
                            }
                          }}
                          className="w-full md:w-24"
                        />
                      </div>
                      {errors[`product-${index}`] && (
                        <p className="text-red-500 text-sm">{errors[`product-${index}`]}</p>
                      )}
                      {errors[`quantity-${index}`] && (
                        <p className="text-red-500 text-sm">{errors[`quantity-${index}`]}</p>
                      )}
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (newCustomer.isMultiBranch) {
                        addBranchOrderItem(selectedBranch)
                      } else {
                        addOrderItem()
                      }
                    }}
                    className="mt-4"
                  >
                    <Plus className="h-4 w-4 mr-2" /> הוסף מוצר
                    {newCustomer.isMultiBranch && (
                      <span className="text-sm mr-1">
                        ל{newCustomer.branches[selectedBranch]?.name || `סניף ${selectedBranch + 1}`}
                      </span>
                    )}
                  </Button>

                  <div className="space-y-2">
                    <Label htmlFor="notes">הערות</Label>
                    <Textarea
                      id="notes"
                      placeholder="הערות נוספות להזמנה"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                </>
              )}
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            {step > 1 && (
              <Button
                type="button"
                onClick={handleBack}
              >
                חזור
              </Button>
            )}
            {step < 3 ? (
              <Button
                type="button"
                onClick={handleNextStep}
              >
                המשך
              </Button>
            ) : (
              <Button
                type="button"
                disabled={isLoading || (newCustomer.isMultiBranch 
                  ? !Object.values(branchOrderItems).some(branchItems => 
                      branchItems && branchItems.length > 0 && branchItems.some(item => item.productId)
                    )
                  : orderItems.some(item => !item.productId)
                )}
                onClick={handleSubmit}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    מעבד...
                  </>
                ) : (
                  'צור הזמנה'
                )}
              </Button>
            )}
          </CardFooter>
        </Card>
      </main>
      {errors.submit && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{errors.submit}</p>
        </div>
      )}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center">
            <h3 className="text-xl font-bold mb-2">ההזמנה נשלחה בהצלחה!</h3>
            <p className="text-gray-600">מעביר אותך לדף ההזמנות...</p>
          </div>
        </div>
      )}
    </div>
  )
}