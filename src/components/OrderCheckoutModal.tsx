import React, { useState } from 'react';
import { ChefProgram, UserProfile, CustomerMealPlan, OrderRecord } from '../types';
import { PACKAGE_CONFIGS } from '../data/packages';
import { CheckCircle, ChefHat, Sparkles, X, ShieldCheck, MapPin, Phone, CreditCard, Calendar, Users, Clock, Truck, QrCode } from 'lucide-react';
import confetti from 'canvas-confetti';

const YANGON_TOWNSHIPS = [
  'Bahan Township',
  'Dagon Township',
  'Kamayut Township',
  'Yankin Township',
  'Sanchaung Township',
  'Hlaing Township',
  'Mayangone Township',
  'Botataung Township',
  'Kyauktada Township',
  'Pabedan Township',
  'Lanmadaw Township',
  'Latha Township',
  'Ahlone Township',
  'Tamwe Township',
  'Thingangyun Township',
  'South Okkalapa Township',
  'North Okkalapa Township',
  'Insein Township',
  'North Dagon Township',
  'South Dagon Township',
  'Mingalar Taung Nyunt Township',
  'Dawbon Township',
  'Thaketa Township',
  'Thanlyin Township'
];

interface OrderCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  program?: ChefProgram;
  mealPlan?: CustomerMealPlan | null;
  userProfile: UserProfile;
  onConfirmOrder: (orderData: Partial<OrderRecord>) => void;
  onViewActiveSchedule?: () => void;
  isScheduleActive?: boolean;
  activeScheduleName?: string;
  activeScheduleEnd?: string;
}

export const OrderCheckoutModal: React.FC<OrderCheckoutModalProps> = ({
  isOpen,
  onClose,
  program,
  mealPlan,
  userProfile,
  onConfirmOrder,
  onViewActiveSchedule,
  isScheduleActive = false,
  activeScheduleName,
  activeScheduleEnd
}) => {
  const [selectedTownship, setSelectedTownship] = useState('Bahan Township');
  const [deliveryStreetAddress, setDeliveryStreetAddress] = useState('No. 42, Sayar San Road, Room 4B');
  const [contactPhone, setContactPhone] = useState('09-798-123456');
  const [deliverySlot, setDeliverySlot] = useState<'morning' | 'afternoon'>('morning');
  const [paymentMethod, setPaymentMethod] = useState<'cod'>('cod');
  const [notes, setNotes] = useState('Please ring door bell upon arrival.');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [confirmedOrderNum, setConfirmedOrderNum] = useState('');

  if (!isOpen) return null;

  const isChefProgram = !!program || mealPlan?.planType === 'chef_program';
  const tierKey = program?.packageTier || mealPlan?.packageTier || 'standard';
  const pkgConfig = PACKAGE_CONFIGS[tierKey];

  const durationDays = program?.durationDays || mealPlan?.durationDays || 7;
  const originalPrice = program?.originalPriceMMK || (mealPlan ? mealPlan.totalPlanCostMMK : 126000);
  const finalPrice = program?.finalPriceMMK || (mealPlan ? mealPlan.totalPlanCostMMK : 126000);
  const discountAmount = originalPrice - finalPrice;
  const isSoldOut = isChefProgram && !!program && program.enrolledCustomers >= program.maxCustomers;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const orderNum = `NC-YGN-${Date.now().toString().slice(-6)}`;
    setConfirmedOrderNum(orderNum);
    setIsSubmitted(true);

    confetti({
      particleCount: 110,
      spread: 80,
      origin: { y: 0.6 }
    });

    const fullAddress = `${deliveryStreetAddress}, ${selectedTownship}, Yangon`;

    onConfirmOrder({
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      customerId: userProfile.id,
      customerName: userProfile.name,
      planId: mealPlan?.id,
      chefProgramId: program?.id,
      planDisplayName: program ? program.programName : `NutriChef Personalized Plan (${durationDays} Days)`,
      packageTier: tierKey,
      durationDays,
      dailyCalories: userProfile.calorieTarget,
      dailyProteinG: userProfile.proteinGrams,
      totalAmountMMK: finalPrice,
      deliveryTownship: selectedTownship,
      deliveryAddress: fullAddress,
      deliverySlot,
      contactPhone,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      orderStatus: 'confirmed',
      createdAt: new Date().toISOString(),
      startDate: program?.startDate || new Date(Date.now() + 86400000).toISOString().slice(0, 10),
      notes
    });
  };

  return (
    <div className="modal-backdrop" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem',
      backdropFilter: 'blur(4px)'
    }}>
      <div className="modal-card" style={{
        background: '#ffffff',
        borderRadius: '16px',
        maxWidth: '640px',
        width: '100%',
        maxHeight: '92vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid #e2e8f0'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: isChefProgram ? 'linear-gradient(135deg, #fef3c7 0%, #ffffff 100%)' : '#f8fafc',
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              background: isChefProgram ? '#d97706' : 'var(--primary)',
              color: '#ffffff',
              padding: '0.5rem',
              borderRadius: '10px'
            }}>
              {isChefProgram ? <ChefHat size={22} /> : <Sparkles size={22} />}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a' }}>
                {isChefProgram ? 'Confirm Chef Program Subscription' : 'Confirm Meal Plan Order'}
              </h3>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                {isChefProgram ? 'Limited Cohort Enrollment' : 'NutriChef Precision Daily Schedule'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#64748b',
              padding: '0.4rem',
              borderRadius: '8px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem' }}>
          {isSubmitted ? (
            <div style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
              <div style={{
                background: '#dcfce7',
                color: '#15803d',
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}>
                <CheckCircle size={36} />
              </div>
              <h2 style={{ fontSize: '1.45rem', color: '#0f172a', marginBottom: '0.35rem' }}>Order Confirmed & Enrolled!</h2>
              <p style={{ color: '#15803d', fontWeight: 700, fontSize: '0.9rem', marginBottom: '1rem' }}>
                Order #{confirmedOrderNum}
              </p>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem', textAlign: 'left', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                  <span style={{ color: '#64748b' }}>Customer:</span>
                  <strong>{userProfile.name} ({contactPhone})</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                  <span style={{ color: '#64748b' }}>Township & Address:</span>
                  <span style={{ maxWidth: '300px', textAlign: 'right', fontWeight: 600 }}>{deliveryStreetAddress}, {selectedTownship}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                  <span style={{ color: '#64748b' }}>Delivery Time Slot:</span>
                  <span style={{ color: '#15803d', fontWeight: 700 }}>
                    {deliverySlot === 'morning' ? 'Morning (7:00 AM – 9:30 AM)' : 'Afternoon (11:30 AM – 1:30 PM)'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                  <span style={{ color: '#64748b' }}>Payment Method:</span>
                  <span style={{ textTransform: 'uppercase', fontWeight: 700, color: '#0369a1' }}>{paymentMethod}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', borderTop: '1px solid #e2e8f0', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                  <strong>Total Amount:</strong>
                  <strong style={{ color: 'var(--primary)', fontSize: '1.15rem' }}>{finalPrice.toLocaleString()} MMK</strong>
                </div>
              </div>

              <button
                className="btn-gold"
                style={{ width: '100%', padding: '0.85rem' }}
                onClick={onViewActiveSchedule || onClose}
              >
                View Active Meal Schedule
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Program Summary Card */}
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1rem 1.25rem',
                marginBottom: '1.25rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div>
                    <span className={`tier-badge badge-tier${tierKey === 'basic' ? '1' : tierKey === 'standard' ? '2' : '3'}`}>
                      {pkgConfig.name}
                    </span>
                    <h4 style={{ margin: '0.35rem 0 0.2rem', fontSize: '1.1rem', color: '#0f172a' }}>
                      {program ? program.programName : `NutriChef Personalized Plan (${durationDays} Days)`}
                    </h4>
                    {program && (
                      <span style={{ fontSize: '0.82rem', color: '#d97706', fontWeight: 600 }}>
                        Curated by {program.chefName} • Starts {program.startDate}
                      </span>
                    )}
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    {discountAmount > 0 && (
                      <span style={{ fontSize: '0.75rem', textDecoration: 'line-through', color: '#94a3b8', display: 'block' }}>
                        {originalPrice.toLocaleString()} MMK
                      </span>
                    )}
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
                      {finalPrice.toLocaleString()} MMK
                    </span>
                    {discountAmount > 0 && (
                      <span style={{ display: 'block', fontSize: '0.75rem', color: '#dc2626', fontWeight: 700 }}>
                        Save {discountAmount.toLocaleString()} MMK ({program?.discountPercentage}% Off)
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.82rem', color: '#334155', borderTop: '1px solid #e2e8f0', paddingTop: '0.6rem', marginTop: '0.6rem' }}>
                  <div>
                    <strong>Date:</strong>{' '}
                    {(() => {
                      const start = program?.startDate ? new Date(`${program.startDate}T00:00:00`) : new Date();
                      if (!program?.startDate) start.setDate(start.getDate() + 1);
                      const end = new Date(start);
                      end.setDate(end.getDate() + durationDays - 1);
                      const sStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                      const eStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                      return `${sStr} – ${eStr}`;
                    })()}
                  </div>
                  <div>
                    <strong>Delivery:</strong>{' '}
                    <span style={{
                      fontWeight: 700,
                      color: (!program || program.deliveryAllowed || program.mealsReleased) ? '#15803d' : '#b45309'
                    }}>
                      {(!program || program.deliveryAllowed || program.mealsReleased) ? 'Allow for delivery' : 'Not Allow for delivery'}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#64748b', marginTop: '0.4rem' }}>
                  <span>🎯 {userProfile.calorieTarget} kcal/day</span>
                  <span>🥩 {userProfile.proteinGrams}g Protein</span>
                  <span>⏱️ {durationDays} Days ({durationDays * 3} Fresh Meals)</span>
                </div>
              </div>

              {/* Yangon Township & Address Selection */}
              <div className="grid-2" style={{ gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.3rem' }}>
                    <MapPin size={15} color="var(--primary)" />
                    Yangon Township
                  </label>
                  <select
                    className="form-select"
                    value={selectedTownship}
                    onChange={(e) => setSelectedTownship(e.target.value)}
                  >
                    {YANGON_TOWNSHIPS.map((ts) => (
                      <option key={ts} value={ts}>{ts}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.3rem' }}>
                    <Phone size={15} color="var(--primary)" />
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="09-xxxxxxxxx"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <label className="form-label" style={{ marginBottom: '0.3rem' }}>Street & Unit Details</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={deliveryStreetAddress}
                  onChange={(e) => setDeliveryStreetAddress(e.target.value)}
                  placeholder="Street name, building number, floor / condo unit"
                />
              </div>

              {/* Delivery Slot Choice */}
              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.4rem' }}>
                  <Clock size={15} color="var(--primary)" />
                  Daily Delivery Time Window
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                  <div
                    onClick={() => setDeliverySlot('morning')}
                    style={{
                      padding: '0.65rem 0.8rem',
                      borderRadius: '8px',
                      border: deliverySlot === 'morning' ? '2px solid var(--primary)' : '1px solid #cbd5e1',
                      background: deliverySlot === 'morning' ? '#ecfdf5' : '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <Truck size={18} color={deliverySlot === 'morning' ? '#15803d' : '#64748b'} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem', color: deliverySlot === 'morning' ? '#15803d' : '#0f172a' }}>
                        Morning Delivery
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>7:00 AM – 9:30 AM</div>
                    </div>
                  </div>

                  <div
                    onClick={() => setDeliverySlot('afternoon')}
                    style={{
                      padding: '0.65rem 0.8rem',
                      borderRadius: '8px',
                      border: deliverySlot === 'afternoon' ? '2px solid var(--primary)' : '1px solid #cbd5e1',
                      background: deliverySlot === 'afternoon' ? '#ecfdf5' : '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <Clock size={18} color={deliverySlot === 'afternoon' ? '#15803d' : '#64748b'} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem', color: deliverySlot === 'afternoon' ? '#15803d' : '#0f172a' }}>
                        Afternoon Delivery
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>11:30 AM – 1:30 PM</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method & Simulation */}
              {/* Payment Method: Cash / COD Only */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.4rem' }}>
                  <CreditCard size={15} color="var(--primary)" />
                  Payment Method (Myanmar MMK)
                </label>
                <div style={{
                  background: '#f0fdf4',
                  border: '2px solid var(--primary)',
                  borderRadius: '10px',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{ background: '#dcfce7', color: '#15803d', padding: '0.4rem', borderRadius: '8px', display: 'flex' }}>
                      <CheckCircle size={18} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#14532d' }}>
                        Cash on Delivery (Cash / COD)
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#166534' }}>
                        Pay in Myanmar Kyats (MMK) directly to the delivery rider upon arrival.
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, background: '#dcfce7', color: '#15803d', padding: '0.2rem 0.55rem', borderRadius: '6px', whiteSpace: 'nowrap' }}>
                    Zero Upfront Fees
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label" style={{ marginBottom: '0.3rem' }}>Special Instructions / Delivery Notes</label>
                <input
                  type="text"
                  className="form-input"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Dietary allergies, gate entry instructions..."
                />
              </div>

              {/* Active Plan Lock Warning */}
              {isScheduleActive && (
                <div style={{
                  background: '#fef2f2',
                  border: '1.5px solid #fca5a5',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  fontSize: '0.82rem',
                  color: '#991b1b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '1.25rem',
                  fontWeight: 700
                }}>
                  <X size={18} />
                  <span>
                    Concurrent orders locked: You have an active ongoing plan ({activeScheduleName || 'Current Plan'}) active until {activeScheduleEnd}. Please cancel or wait for it to complete.
                  </span>
                </div>
              )}

              {/* Sold Out Warning */}
              {isSoldOut && (
                <div style={{
                  background: '#fef2f2',
                  border: '1.5px solid #fca5a5',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  fontSize: '0.82rem',
                  color: '#991b1b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '1.25rem',
                  fontWeight: 700
                }}>
                  <X size={18} />
                  <span>
                    This Chef Program has reached maximum capacity ({program?.maxCustomers}/{program?.maxCustomers} enrolled). No seats available.
                  </span>
                </div>
              )}

              {/* Security Assurance Badge */}
              <div style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                padding: '0.6rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.78rem',
                color: '#166534',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1.25rem'
              }}>
                <ShieldCheck size={16} />
                <span>Hygiene & Quality Guarantee: Prepared fresh daily with chilled dispatch box packaging across Yangon.</span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ flex: 1 }}
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isScheduleActive || isSoldOut}
                  className="btn-gold"
                  style={{
                    flex: 2,
                    padding: '0.85rem',
                    opacity: isScheduleActive || isSoldOut ? 0.5 : 1,
                    cursor: isScheduleActive || isSoldOut ? 'not-allowed' : 'pointer'
                  }}
                >
                  <CheckCircle size={18} />
                  <span>{isSoldOut ? 'Program Sold Out' : isScheduleActive ? 'Ordering Locked' : `Confirm Order (${finalPrice.toLocaleString()} MMK)`}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
