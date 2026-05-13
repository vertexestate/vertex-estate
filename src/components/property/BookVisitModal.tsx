import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
interface BookVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyTitle: string;
}
export function BookVisitModal({
  isOpen,
  onClose,
  propertyTitle
}: BookVisitModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: ''
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Visit booked successfully! We will contact you shortly.');
    onClose();
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Book a Visit" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <p className="text-navy-600 dark:text-navy-400 mb-4">
            Schedule a visit to{' '}
            <span className="font-semibold">{propertyTitle}</span>
          </p>
        </div>

        <Input
          label="Full Name"
          type="text"
          required
          value={formData.name}
          onChange={(e) =>
          setFormData({
            ...formData,
            name: e.target.value
          })
          } />
        

        <Input
          label="Email"
          type="email"
          required
          value={formData.email}
          onChange={(e) =>
          setFormData({
            ...formData,
            email: e.target.value
          })
          } />
        

        <Input
          label="Phone"
          type="tel"
          required
          value={formData.phone}
          onChange={(e) =>
          setFormData({
            ...formData,
            phone: e.target.value
          })
          } />
        

        <Input
          label="Preferred Date"
          type="date"
          required
          value={formData.date}
          onChange={(e) =>
          setFormData({
            ...formData,
            date: e.target.value
          })
          } />
        

        <Select
          label="Preferred Time"
          required
          options={[
          {
            value: '',
            label: 'Select a time'
          },
          {
            value: '9:00',
            label: '9:00 AM'
          },
          {
            value: '10:00',
            label: '10:00 AM'
          },
          {
            value: '11:00',
            label: '11:00 AM'
          },
          {
            value: '14:00',
            label: '2:00 PM'
          },
          {
            value: '15:00',
            label: '3:00 PM'
          },
          {
            value: '16:00',
            label: '4:00 PM'
          }]
          }
          value={formData.time}
          onChange={(e) =>
          setFormData({
            ...formData,
            time: e.target.value
          })
          } />
        

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="flex-1">
            
            Cancel
          </Button>
          <Button type="submit" variant="primary" className="flex-1">
            Confirm Booking
          </Button>
        </div>
      </form>
    </Modal>);

}