import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ThemeSwitcher from "../components/ThemeSwitcher";
import { FaArrowLeft, FaHome } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        lastName: '',
        number: '',
        email: '',
        username: '',
        roleId: '1',
        country: '',
        city: '',
        gender: '', 
        birthday: '' 
    });
    const [validation, setValidation] = useState({
        username: { available: null, checking: false },
        email: { available: null, checking: false }
    });
    const [countryList, setCountryList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [message, setMessage] = useState('');
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
const today = new Date();
const minBirthday = new Date(
  today.getFullYear() - 120, // Maximum age: 120 years old
  today.getMonth(),
  today.getDate()
).toISOString().split('T')[0];

const maxBirthday = new Date(
  today.getFullYear() - 10, // Minimum age: 10 years old
  today.getMonth(),
  today.getDate()
).toISOString().split('T')[0];

    const debounce = (func, delay) => {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => func.apply(this, args), delay);
        };
    };

    const checkIdentifier = useCallback(debounce(async (type, value) => {
        if (!value || (type === 'username' && value.length < 3)) {
            setValidation(prev => ({ ...prev, [type]: { available: null, checking: false } }));
            return;
        }

        setValidation(prev => ({ ...prev, [type]: { ...prev[type], checking: true } }));

        try {
            const response = await axios.get(`http://localhost:5001/api/login/check/${value}`);

            if (response.data.exists) {
                const isCurrentType = response.data.type === type;
                setValidation(prev => ({
                    ...prev,
                    [type]: { available: !isCurrentType, checking: false }
                }));
            } else {
                setValidation(prev => ({
                    ...prev,
                    [type]: { available: true, checking: false }
                }));
            }
        } catch (error) {
            console.error(`Error checking ${type}:`, error);
            setValidation(prev => ({ ...prev, [type]: { available: null, checking: false } }));
        }
    }, 500), []);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await axios.get("https://countriesnow.space/api/v0.1/countries", {
                    withCredentials: false
                });
                if (response.data?.data) {
                    setCountryList(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching countries:", error);
            }
        };
        fetchCountries();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'username') {
            setValidation(prev => ({ ...prev, username: { available: null, checking: false } }));
            checkIdentifier('username', value);
        }

        if (name === 'email') {
            setValidation(prev => ({ ...prev, email: { available: null, checking: false } }));
            if (value.includes('@') && value.includes('.')) {
                checkIdentifier('email', value);
            }
        }
    };

    const handleCountryChange = (e) => {
        const country = e.target.value;
        setSelectedCountry(country);
        setFormData(prev => ({ ...prev, country }));

        if (country === "Kosovo") {
            setCityList([
                "Prishtina", "Prizreni", "Peja", "Gjakova", "Ferizaj", "Gjilani", "Mitrovica",
                "Podujeva", "Vushtrria", "Suhareka", "Rahoveci", "Malisheva", "Drenasi", "Skenderaj",
                "Kamenica", "Istogu", "Deçani", "Dragashi", "Klinë", "Leposaviq", "Zubin Potok", "Zveçan",
                "Shtime", "Fushë Kosova", "Lipjan", "Obiliq", "Novobërda", "Junik", "Hani i Elezit",
                "Kaçaniku", "Mamushë", "Graçanica", "Ranillug", "Partesh", "Kllokot"
            ]);
        } else {
            const countryData = countryList.find(c => c.country === country);
            setCityList(countryData ? countryData.cities : []);
        }

        setSelectedCity("");
        setFormData(prev => ({ ...prev, city: "" }));
    };

    const handleCityChange = (e) => {
        setFormData({ ...formData, city: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validation.username.available === false) {
            setMessage('Please choose a different username');
            return;
        }

        if (validation.email.available === false) {
            setMessage('This email is already registered');
            return;
        }

        if ((validation.username.checking || validation.email.checking) ||
            (validation.username.available === null && formData.username.length >= 3) ||
            (validation.email.available === null && formData.email.includes('@'))) {
            setMessage('Please wait while we validate your information');
            return;
        }

        try {
            await axios.post('http://localhost:5001/api/user', formData, { withCredentials: true });
            setIsSubmitted(true);
        } catch (error) {
            setMessage('Error during registration: ' + (error.response?.data?.message || error.message));
        }
    };

    const renderValidationStatus = (type) => {
        const { available, checking } = validation[type];

        if (checking) {
            return <p className="text-sm text-gray-500 mt-1">Checking {type}...</p>;
        }
        if (available === true) {
            return <p className="text-sm text-green-500 mt-1">{type.charAt(0).toUpperCase() + type.slice(1)} is available!</p>;
        }
        if (available === false) {
            return <p className="text-sm text-red-500 mt-1">{type.charAt(0).toUpperCase() + type.slice(1)} is already taken</p>;
        }
        return null;
    };

    if (isSubmitted) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen dark:bg-gray-900">
                <h1 className="text-4xl text-green-500 font-bold">Registration Successful!</h1>
                <Link to="/login" className="mt-4 text-teal-600 hover:underline">Go to Login</Link>
            </div>
        );
    }

    return (
        <div className="flex font-poppins items-center justify-center dark:bg-gray-900 min-w-screen min-h-screen">
            <div className="grid gap-8 w-full max-w-2xl">
                <div className="absolute top-5 left-5 z-10">
                    <Link 
                        to="/" 
                        className="flex items-center space-x-2 text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-blue-300 transition-colors duration-300"
                    >
                        <FaArrowLeft className="text-lg" />
                        <span className="font-medium">Back to Home</span>
                    </Link>
                </div>
                <div className="absolute top-5 right-5 z-10">
                    <ThemeSwitcher />
                </div>
                <div id="back-div" className="bg-gradient-to-r from-teal-400 to-teal-700 rounded-[26px] m-4">
                    <div className="border-[20px] border-transparent rounded-[20px] dark:bg-gray-900 bg-white shadow-lg xl:p-12 lg:p-12 md:p-10 sm:p-6 p-4 m-2">
                        <h1 className="font-bold text-5xl text-teal-500 mb-2 dark:text-teal-400 text-center">Register</h1>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="flex gap-4">
                                {['name', 'lastName'].map((field) => (
                                    <div className="w-1/2 mb-5" key={field}>
                                        <label className="mb-2 dark:text-gray-400 text-lg block" htmlFor={field}>
                                            {field.charAt(0).toUpperCase() + field.slice(1)}
                                        </label>
                                        <input
                                            type="text"
                                            id={field}
                                            name={field}
                                            value={formData[field]}
                                            onChange={handleChange}
                                            className="border dark:bg-teal-700 dark:text-gray-300 dark:border-gray-700 p-4 shadow-md placeholder:text-base border-gray-300 rounded-lg w-full"
                                            required
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-4">
                                <div className="w-1/2 mb-5">
                                    <label className="mb-2 dark:text-gray-400 text-lg block" htmlFor="number">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        id="number"
                                        name="number"
                                        value={formData.number}
                                        onChange={handleChange}
                                        className="border dark:bg-teal-700 dark:text-gray-300 dark:border-gray-700 p-4 shadow-md placeholder:text-base border-gray-300 rounded-lg w-full"
                                        required
                                    />
                                </div>
                                <div className="w-1/2 mb-5">
                                    <label className="mb-2 dark:text-gray-400 text-lg block" htmlFor="username">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="border dark:bg-teal-700 dark:text-gray-300 dark:border-gray-700 p-4 shadow-md placeholder:text-base border-gray-300 rounded-lg w-full"
                                        required
                                        minLength="3"
                                    />
                                    {renderValidationStatus('username')}
                                </div>
                            </div>

                            <div className="mb-5">
                                <label className="mb-2 dark:text-gray-400 text-lg block" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="border dark:bg-teal-700 dark:text-gray-300 dark:border-gray-700 p-4 shadow-md placeholder:text-base border-gray-300 rounded-lg w-full"
                                    required
                                    
                                />
                                {renderValidationStatus('email')}
                            </div>

                            <div className="flex gap-4">
                                <div className="w-1/2">
                                    <label className="mb-2 dark:text-gray-400 text-lg block" htmlFor="country">
                                        Country
                                    </label>
                                    <select
                                        id="country"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleCountryChange}
                                        className="border dark:bg-teal-700 dark:text-gray-300 dark:border-gray-700 p-4 border-gray-300 rounded-lg w-full"
                                        required
                                    >
                                        <option value="">Select Country</option>
                                        {countryList.map((country) => (
                                            <option key={country.country} value={country.country}>
                                                {country.country}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="w-1/2">
                                    <label className="mb-2 dark:text-gray-400 text-lg block" htmlFor="city">
                                        City
                                    </label>
                                    <select
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleCityChange}
                                        className="border dark:bg-teal-700 dark:text-gray-300 dark:border-gray-700 p-4 border-gray-300 rounded-lg w-full"
                                        required
                                    >
                                        <option value="">Select City</option>
                                        {cityList.map((city) => (
                                            <option key={city} value={city}>
                                                {city}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-1/2">
                                    <label className="mb-2 dark:text-gray-400 text-lg block" htmlFor="gender">
                                        Gender
                                    </label>
                                    <select
                                        id="gender"
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="border dark:bg-teal-700 dark:text-gray-300 dark:border-gray-700 p-4 border-gray-300 rounded-lg w-full"
                                        required
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Female">Female</option>
                                        <option value="Male">Male</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                  <div className="mb-5">
  <label className="mb-2 dark:text-gray-400 text-lg block" htmlFor="birthday">
    Birthday
  </label>
  <input
    type="date"
    id="birthday"
    name="birthday"
    min={minBirthday}
    max={maxBirthday}
    value={formData.birthday}
    onChange={handleChange}
    className="border dark:bg-teal-700 dark:text-gray-300 dark:border-gray-700 p-4 shadow-md placeholder:text-base border-gray-300 rounded-lg w-full"
    required
  />
</div>

                            </div>

                            {message && <p className="text-red-500 text-sm">{message}</p>}
                            <button
                                type="submit"
                                className="w-full py-3 px-6 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition duration-300"
                            >
                                Register
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
