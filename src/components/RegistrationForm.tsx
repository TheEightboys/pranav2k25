import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { isValidPhoneNumber } from 'libphonenumber-js';
// import { v4 as uuidv4 } from 'uuid'; // Remove UUID library import

interface Participant {
  name: string;
  email: string;
  phone: string;
}

interface Event {
  id: string;
  name: string;
  price: number;
}

interface FormErrors {
  [key: string]: string;
}

// Firebase config - replace with your actual config
const firebaseConfig = {
  apiKey: "AIzaSyAaUkjeSXqpppIO4A0bd7bBiP8Wncv4juE",
  authDomain: "sympo-acd3c.firebaseapp.com",
  projectId: "sympo-acd3c",
  storageBucket: "sympo-acd3c.firebasestorage.app",
  messagingSenderId: "585418921196",
  appId: "1:585418921196:web:61f6c504a7b4691364c1c9"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

const RegistrationPage: React.FC = () => {
  // State declarations
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [teamName, setTeamName] = useState<string>('');
  const [participants, setParticipants] = useState<Participant[]>([
    { name: '', email: '', phone: '' },
    { name: '', email: '', phone: '' },
  ]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [transactionId, setTransactionId] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [upiQRUrl, setUpiQRUrl] = useState<string>('');
  const [isPaymentComplete, setIsPaymentComplete] = useState<boolean>(false);

  // UPI details
  const UPI_ID = "kishore.m12th@okaxis";
  const MERCHANT_NAME = "PRANAV2k25 Events";

  // Events data - Modified to remove 'coordinators'
  const EVENTS = {
    technical: [
      { id: 'Paper Presentation', name: 'Paper Presentation', price: 20 },
      { id: 'Project expo/Hackathon', name: 'Project expo/Hackathon', price: 20 },
      { id: 'Wired-WOnders', name: 'Wired-WOnders', price: 20 },
      { id: 'Roll and dice', name: 'Roll and dice ', price: 20 },
      { id: 'Robot Craze', name: 'Robot Craze ', price: 20 },
    ],
    nonTechnical: [
      { id: 'Anime ', name: ' ANIME AND MANGA', price: 10 },
      { id: 'Aural Bliss', name: 'AURAL BLISS', price: 10 },
      { id: 'TreasureHunt', name: 'TREASURE HUNT', price: 10 },
      { id: 'ElectroF', name: 'ELECTRO FIELD', price: 10 },
      { id: 'SportsBz', name: 'SPORTS BUZZ', price: 10 },
      { id: 'OjingeoGame', name: 'OJINGEO GAME', price: 10 },
    ],
    workshop: [
      { id: 'DRONE ', name: 'DRONE WORKSHOP', price: 20 },
    ],
    onlineevents: [
      { id: 'shortfilm ', name: 'SHORT FILM', price: 20 },
      { id: 'esports ', name: 'E-sports(FreeFIre/BGMI🔥', price: 20 },
    ],
  };

  // Calculate total price based on selected events
  useEffect(() => {
    let price = 0;

    selectedEvents.forEach(eventId => {
      for (const category in EVENTS) {
        const event = EVENTS[category as keyof typeof EVENTS].find(e => e.id === eventId);
        if (event) {
          price += event.price;
          break;
        }
      }
    });

    setTotalPrice(price);
  }, [selectedEvents]);

  // Generate UPI QR code whenever total price changes
  useEffect(() => {
    if (totalPrice > 0) {
      // Generate UPI payment URL
      const upiURL = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${totalPrice}&cu=INR&tn=${encodeURIComponent('Event Registration')}`;

      // Generate QR code URL using a free QR code API
      const qrCodeURL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiURL)}`;
      setUpiQRUrl(qrCodeURL);
    }
  }, [totalPrice]);

  // Event selection toggle
  const toggleEventSelection = (eventId: string) => {
    if (selectedEvents.includes(eventId)) {
      setSelectedEvents(selectedEvents.filter((id) => id !== eventId));
    } else {
      setSelectedEvents([...selectedEvents, eventId]);
    }
  };

  // Add participant
  const addParticipant = () => {
    if (participants.length < 6) {
      setParticipants([...participants, { name: '', email: '', phone: '' }]);
    } else {
      alert('Maximum Limit: You can add up to 6 participants only.');
    }
  };

  // Remove participant
  const removeParticipant = (index: number) => {
    if (participants.length > 1) {
      const newParticipants = [...participants];
      newParticipants.splice(index, 1);
      setParticipants(newParticipants);
    } else {
      alert('Minimum Required: At least 1 participant is required.');
    }
  };

  // Update participant details
  const updateParticipant = (index: number, field: keyof Participant, value: string) => {
    const newParticipants = [...participants];
    newParticipants[index][field] = value;
    setParticipants(newParticipants);
  };

  // Form validation for first step (team and event selection)
  const validateFirstStep = (): boolean => {
    let errors: FormErrors = {};

    if (teamName.trim() === '') {
      errors.teamName = 'Please enter a team name';
    }

    if (selectedEvents.length === 0) {
      errors.events = 'Please select at least one event';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Form validation for second step (participant details)
  const validateSecondStep = (): boolean => {
    let errors: FormErrors = {};

    for (let i = 0; i < participants.length; i++) {
      const p = participants[i];
      if (p.name.trim() === '') {
        errors[`participants[${i}].name`] = `Please enter name for Participant ${i + 1}`;
      }
      if (p.email.trim() === '') {
        errors[`participants[${i}].email`] = `Please enter email for Participant ${i + 1}`;
      }
      if (p.phone.trim() === '') {
        errors[`participants[${i}].phone`] = `Please enter phone for Participant ${i + 1}`;
      }

      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (p.email && !emailRegex.test(p.email)) {
        errors[`participants[${i}].email`] = `Invalid email for Participant ${i + 1}`;
      }

      // Phone number validation
      if (p.phone && !isValidPhoneNumber(p.phone, 'IN')) {
        errors[`participants[${i}].phone`] = `Invalid phone number for Participant ${i + 1}`;
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Form validation for payment step
  const validatePaymentStep = (): boolean => {
    let errors: FormErrors = {};

    if (transactionId.trim() === '') {
      errors.transactionId = 'Please enter your transaction ID';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle moving to next step
  const handleNextStep = () => {
    if (currentStep === 1) {
      if (validateFirstStep()) {
        setCurrentStep(2);
        window.scrollTo(0, 0);
      }
    } else if (currentStep === 2) {
      if (validateSecondStep()) {
        setCurrentStep(3);
        window.scrollTo(0, 0);
      }
    }
  };

  // Handle going back to previous step
  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  // Define payment status constants (same as app)
  const PAYMENT_STATUS = {
    PENDING: 'PENDING',
    VERIFICATION_PENDING: 'VERIFICATION_PENDING',
    COMPLETED: 'COMPLETED',
    FAILED: 'FAILED'
  };

  // Handle form submission
  const handleRegistration = async () => {
    // Only validate transaction ID
    if (!validatePaymentStep()) return;

    setIsSubmitting(true);
    try {
      // Generate a unique transaction ID (using app's method)
      const generatedTransactionId = `PRANAV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      setTransactionId(generatedTransactionId);

      // Prepare registration data
      const registrationData = {
        registrationNumber: participants[0].phone,
        teamName,
        participants,
        events: selectedEvents, // Store event IDs
        totalPrice,
        registrationDate: new Date(),
        attendanceMarked: false,
        marks: {},
        paymentStatus: PAYMENT_STATUS.VERIFICATION_PENDING, // Use consistent status
        paymentMethod: 'UPI/Bank Transfer',
        transactionId: generatedTransactionId // Use generated transaction ID
      };

      // Store in Firestore with phone number as ID
      const phoneNumber = participants[0].phone;
      const registrationsRef = collection(db, 'registrations');
      const docRef = doc(registrationsRef, phoneNumber);
      await setDoc(docRef, registrationData);

      console.log('Registration added with ID: ', phoneNumber);
      setSuccessMessage('Registration Successful! Your registration number is: ' + phoneNumber);
      setIsPaymentComplete(true);

      // Reset form
      setTeamName('');
      setSelectedEvents([]);
      setParticipants([{ name: '', email: '', phone: '' }, { name: '', email: '', phone: '' }]);
      setTransactionId('');
      setFormErrors({});
      setCurrentStep(1);

      // Scroll to top to show success message
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Error adding registration: ', error);
      setFormErrors({
        submission: 'Failed to submit registration. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Greek mythology themed CSS classes
  const greekStyles = {
    background: "bg-gray-900",
    container: "bg-gray-900 min-h-screen py-8",
    headerText: "text-amber-400 font-serif",
    subheaderText: "text-amber-300 font-serif",
    card: "bg-gray-800 border border-amber-500 shadow-lg rounded-lg p-6 mb-8",
    cardHeader: "text-xl font-bold text-amber-400 mb-4 border-b border-amber-500 pb-2 font-serif",
    cardSubheader: "font-medium text-lg mb-3 text-amber-300 font-serif",
    inputField: "w-full px-3 py-2 bg-gray-700 border-b-2 border-amber-500 text-gray-100 focus:outline-none focus:border-amber-300 rounded-md transition duration-300 placeholder-gray-400",
    checkbox: "form-checkbox h-5 w-5 text-amber-500 border-amber-500",
    label: "text-amber-200 mb-2 font-medium",
    btn: "px-6 py-2 bg-amber-600 text-gray-900 font-bold rounded-md hover:bg-amber-500 hover:shadow-md hover:shadow-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-50 transition-all duration-300",
    btnSecondary: "px-6 py-2 bg-gray-700 text-amber-400 font-bold rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-50 transition-all duration-300",
    btnDanger: "text-red-400 hover:text-red-300 focus:outline-none font-medium",
    stepIndicator: {
      active: "rounded-full h-8 w-8 flex items-center justify-center bg-amber-600 text-gray-900 font-bold",
      inactive: "rounded-full h-8 w-8 flex items-center justify-center bg-gray-700 text-gray-400",
      lineActive: "h-1 w-12 bg-amber-600",
      lineInactive: "h-1 w-12 bg-gray-700"
    },
    errorText: "text-red-400 text-sm mt-1",
    noticeBox: "p-4 bg-gray-700 border border-amber-500 rounded-md text-gray-300",
    successBox: "bg-gray-800 border-2 border-amber-500 rounded-lg p-6 mb-8",
    successHeader: "text-xl font-bold mb-4 text-amber-400 font-serif",
    tableHeader: "p-2 border-b border-amber-500 text-left text-amber-400 font-serif"
  };

  // Render function for the first step
  const renderStep1 = () => (
    <>
      {/* Team Information */}
      <div className={greekStyles.card}>
        <h2 className={greekStyles.cardHeader}>Team Information</h2>
        <div className="mb-4">
          <label htmlFor="teamName" className={greekStyles.label}>
            Team Name
          </label>
          <input
            type="text"
            id="teamName"
            className={greekStyles.inputField}
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Enter team name"
          />
          {formErrors.teamName && (
            <p className={greekStyles.errorText}>{formErrors.teamName}</p>
          )}
        </div>
      </div>

      {/* Event Selection */}
      <div className={greekStyles.card}>
        <h2 className={greekStyles.cardHeader}>Event Selection</h2>
        <p className={greekStyles.cardSubheader}>
          Select the events you want to participate in:
        </p>

        {/* Technical Events */}
        <div className="mb-6">
          <h3 className={greekStyles.subheaderText}>Technical Events</h3>
          {EVENTS.technical.map((event) => (
            <div key={event.id} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={event.id}
                className={greekStyles.checkbox}
                value={event.id}
                checked={selectedEvents.includes(event.id)}
                onChange={() => toggleEventSelection(event.id)}
              />
              <label
                htmlFor={event.id}
                className={greekStyles.label}
                style={{ marginLeft: '0.5rem' }}
              >
                {event.name} - ₹{event.price}
              </label>
            </div>
          ))}
        </div>

        {/* Non-Technical Events */}
        <div className="mb-6">
          <h3 className={greekStyles.subheaderText}>Non-Technical Events</h3>
          {EVENTS.nonTechnical.map((event) => (
            <div key={event.id} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={event.id}
                className={greekStyles.checkbox}
                value={event.id}
                checked={selectedEvents.includes(event.id)}
                onChange={() => toggleEventSelection(event.id)}
              />
              <label
                htmlFor={event.id}
                className={greekStyles.label}
                style={{ marginLeft: '0.5rem' }}
              >
                {event.name} - ₹{event.price}
              </label>
            </div>
          ))}
        </div>

        {/* Workshops */}
        <div className="mb-6">
          <h3 className={greekStyles.subheaderText}>Workshops</h3>
          {EVENTS.workshop.map((event) => (
            <div key={event.id} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={event.id}
                className={greekStyles.checkbox}
                value={event.id}
                checked={selectedEvents.includes(event.id)}
                onChange={() => toggleEventSelection(event.id)}
              />
              <label
                htmlFor={event.id}
                className={greekStyles.label}
                style={{ marginLeft: '0.5rem' }}
              >
                {event.name} - ₹{event.price}
              </label>
            </div>
          ))}
        </div>

        {/* Online Events */}
        <div className="mb-6">
          <h3 className={greekStyles.subheaderText}>Online Events</h3>
          {EVENTS.onlineevents.map((event) => (
            <div key={event.id} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={event.id}
                className={greekStyles.checkbox}
                value={event.id}
                checked={selectedEvents.includes(event.id)}
                onChange={() => toggleEventSelection(event.id)}
              />
              <label
                htmlFor={event.id}
                className={greekStyles.label}
                style={{ marginLeft: '0.5rem' }}
              >
                {event.name} - ₹{event.price}
              </label>
            </div>
          ))}
        </div>

        {formErrors.events && (
          <p className={greekStyles.errorText}>{formErrors.events}</p>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-end mt-6">
        <button
          className={greekStyles.btn}
          onClick={handleNextStep}
          disabled={isSubmitting}
        >
          Next {'>'}
        </button>
      </div>
    </>
  );

  // Render function for the second step
  const renderStep2 = () => (
    <>
      {/* Participants Information */}
      <div className={greekStyles.card}>
        <h2 className={greekStyles.cardHeader}>Participants Information</h2>
        <p className={greekStyles.cardSubheader}>
          Enter details for each participant:
        </p>
        {participants.map((participant, index) => (
          <div key={index} className="mb-6 border-b border-amber-500 pb-4">
            <h3 className={greekStyles.subheaderText}>
              Participant {index + 1}
            </h3>
            <div className="mb-4">
              <label
                htmlFor={`name-${index}`}
                className={greekStyles.label}
              >
                Name
              </label>
              <input
                type="text"
                id={`name-${index}`}
                className={greekStyles.inputField}
                value={participant.name}
                onChange={(e) =>
                  updateParticipant(index, 'name', e.target.value)
                }
                placeholder="Enter name"
              />
              {formErrors[`participants[${index}].name`] && (
                <p className={greekStyles.errorText}>
                  {formErrors[`participants[${index}].name`]}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor={`email-${index}`}
                className={greekStyles.label}
              >
                Email
              </label>
              <input
                type="email"
                id={`email-${index}`}
                className={greekStyles.inputField}
                value={participant.email}
                onChange={(e) =>
                  updateParticipant(index, 'email', e.target.value)
                }
                placeholder="Enter email"
              />
              {formErrors[`participants[${index}].email`] && (
                <p className={greekStyles.errorText}>
                  {formErrors[`participants[${index}].email`]}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor={`phone-${index}`}
                className={greekStyles.label}
              >
                Phone
              </label>
              <input
                type="tel"
                id={`phone-${index}`}
                className={greekStyles.inputField}
                value={participant.phone}
                onChange={(e) =>
                  updateParticipant(index, 'phone', e.target.value)
                }
                placeholder="Enter phone number"
              />
              {formErrors[`participants[${index}].phone`] && (
                <p className={greekStyles.errorText}>
                  {formErrors[`participants[${index}].phone`]}
                </p>
              )}
            </div>
            {index > 0 && (
              <button
                type="button"
                className={greekStyles.btnDanger}
                onClick={() => removeParticipant(index)}
              >
                Remove Participant
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          className={greekStyles.btnSecondary}
          onClick={addParticipant}
        >
          Add Participant
        </button>
        <div className="flex justify-between mt-6">
          <button
            className={greekStyles.btnSecondary}
            onClick={handlePreviousStep}
            disabled={isSubmitting}
          >
            {'<'} Back
          </button>
          <button
            className={greekStyles.btn}
            onClick={handleNextStep}
            disabled={isSubmitting}
          >
            Next {'>'}
          </button>
        </div>
      </div>
    </>
  );

  // Render function for the third step
  const renderStep3 = () => (
    <>
      {/* Payment Information */}
      <div className={greekStyles.card}>
        <h2 className={greekStyles.cardHeader}>Payment Information</h2>
        <p className={greekStyles.cardSubheader}>
          Total Amount: ₹{totalPrice}
        </p>
        <div className="mb-4">
          <label
            htmlFor="transactionId"
            className={greekStyles.label}
          >
            Transaction ID
          </label>
          <input
            type="text"
            id="transactionId"
            className={greekStyles.inputField}
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            placeholder="Enter transaction ID"
          />
          {formErrors.transactionId && (
            <p className={greekStyles.errorText}>
              {formErrors.transactionId}
            </p>
          )}
        </div>

        {/* UPI QR Code (if total price is available) */}
        {totalPrice > 0 && (
          <div className="flex flex-col items-center mb-6">
            <p className={greekStyles.label}>Scan this QR code to pay:</p>
            {upiQRUrl ? (
              <img
                src={upiQRUrl}
                alt="UPI QR Code"
                className="w-48 h-48"
              />
            ) : (
              <p className={greekStyles.errorText}>
                Generating QR Code...
              </p>
            )}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button
          className={greekStyles.btnSecondary}
          onClick={handlePreviousStep}
          disabled={isSubmitting}
        >
          {'<'} Back
        </button>
        <button
          className={greekStyles.btn}
          onClick={handleRegistration}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Complete Registration'}
        </button>
      </div>
    </>
  );

  return (
    <div className={greekStyles.background}>
      <div className={greekStyles.container}>
        <header className="text-center mb-8">
          <h1 className={`text-4xl ${greekStyles.headerText}`}>PRANAV2k25</h1>
          <p className={greekStyles.subheaderText}>Event Registration</p>
        </header>

        {/* Success Message */}
        {successMessage && (
          <div className={greekStyles.successBox}>
            <h2 className={greekStyles.successHeader}>
              {successMessage}
            </h2>
          </div>
        )}

        {/* Registration Form */}
        {!successMessage && (
          <>
            {/* Step Indicators */}
            <div className="flex flex-col items-center mb-8">
              <div className="flex items-center">
                <div className={currentStep >= 1 ? greekStyles.stepIndicator.active : greekStyles.stepIndicator.inactive}>
                  1
                </div>
                <div className={currentStep >= 2 ? greekStyles.stepIndicator.lineActive : greekStyles.stepIndicator.lineInactive}></div>
                <div className={currentStep >= 2 ? greekStyles.stepIndicator.active : greekStyles.stepIndicator.inactive}>
                  2
                </div>
                <div className={currentStep >= 3 ? greekStyles.stepIndicator.lineActive : greekStyles.stepIndicator.lineInactive}></div>
                <div className={currentStep >= 3 ? greekStyles.stepIndicator.active : greekStyles.stepIndicator.inactive}>
                  3
                </div>
              </div>
              <div className="text-sm text-amber-400 font-serif mt-2">
                {currentStep === 1 && 'Step 1: Team & Event Selection'}
                {currentStep === 2 && 'Step 2: Participant Details'}
                {currentStep === 3 && 'Step 3: Payment & Confirmation'}
              </div>
            </div>

            {/* Form Steps */}
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
          </>
        )}

        {/* Greek-inspired footer */}
        <div className="flex justify-center mt-12 mb-6">
          <div className="w-full max-w-2xl border-t border-amber-500 pt-4 flex items-center justify-center">
            <p className="text-amber-300 text-sm font-serif">PRANAV2k25 Events • Inspired by the glory of Mount Olympus</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;