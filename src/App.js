import 'bootstrap/dist/css/bootstrap.min.css';
// A Plotly-based React app to explore the 'response' function with 7 parameters using backend API
import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Legend
} from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale, Legend);

function App() {

  const [params, setParams] = useState([5, 75000, 2.2, 0.1, 0.1, 0.03, 0.03]);
  const [dataPoints, setDataPoints] = useState({ x: [], y: [] });
  const [overlayData, setOverlayData] = useState([]);
  const [showZeroLine, setShowZeroLine] = useState(true);
  const [selectedOverlayIndex, setSelectedOverlayIndex] = useState(null);

  const generateX = () => Array.from({ length: 5000 }, (_, i) => i * 0.01); // 0 to 50 us

  // Translated JavaScript response function
  function response(x, par) {
    const t = x - par[0];
    const A0 = par[1];
    const tp = par[2];
    const CT = 1.0 / 1.996;
    const A = A0 * 2.7433 / Math.pow(tp * CT, 4);
    const p0 = 1.477 / tp / CT;
    const pr1 = 1.417 / tp / CT;
    const pr2 = 1.204 / tp / CT;
    const pi1 = 0.598 / tp / CT;
    const pi2 = 1.299 / tp / CT;

    const k3 = par[3];
    const k4 = par[4];
    const k5 = par[5];
    const k6 = par[6];

    const pow = Math.pow;
    const exp = Math.exp;
    const cos = Math.cos;
    const sin = Math.sin;

    const value = A*((-(k3*k4) + pow(k4,2) + k3*k5 - k4*k5)/(exp(k4*t)*(k4 - k6)*(k4 - p0)*(pow(k4,2) + pow(pi1,2) - 2*k4*pr1 + pow(pr1,2))*(pow(k4,2) + pow(pi2,2) - 2*k4*pr2 + pow(pr2,2))) +
    (-(k3*k5) + k3*k6 + k5*k6 - pow(k6,2))/(exp(k6*t)*(k4 - k6)*(k6 - p0)*(pow(k6,2) + pow(pi1,2) - 2*k6*pr1 + pow(pr1,2))*(pow(k6,2) + pow(pi2,2) - 2*k6*pr2 + pow(pr2,2))) +
    (-(k3*k5) + k3*p0 + k5*p0 - pow(p0,2))/(exp(p0*t)*(k4 - p0)*(-k6 + p0)*(pow(p0,2) + pow(pi1,2) - 2*p0*pr1 + pow(pr1,2))*(pow(p0,2) + pow(pi2,2) - 2*p0*pr2 + pow(pr2,2))) +
  (pi1*((pow(pi1,2) + pow(pr1,2))*(2*k6*(pow(pi1,2) + pow(pr1,2))*(pr1 - pr2) + k6*p0*(-pow(pi1,2) + pow(pi2,2) - pow(pr1,2) + pow(pr2,2)) + (pow(pi1,2) + pow(pr1,2))*(pow(pi1,2) - pow(pi2,2) + (pr1 - pr2)*(2*p0 - 3*pr1 + pr2)) +
           k5*(2*pow(pi1,2)*(-2*pr1 + pr2) + p0*(pow(pi1,2) - pow(pi2,2) - 3*pow(pr1,2) + 4*pr1*pr2 - pow(pr2,2)) + 2*pr1*(pow(pi2,2) + 2*pow(pr1,2) - 3*pr1*pr2 + pow(pr2,2)) +
              k6*(pow(pi1,2) - pow(pi2,2) + (pr1 - pr2)*(2*p0 - 3*pr1 + pr2)))) + k4*((pow(pi1,2) + pow(pr1,2))*(2*(pow(pi1,2) + pow(pr1,2))*(pr1 - pr2) + p0*(-pow(pi1,2) + pow(pi2,2) - pow(pr1,2) + pow(pr2,2))) +
           k5*(2*k6*(pow(pi1,2) + pow(pr1,2))*(pr1 - pr2) - k6*p0*(pow(pi1,2) - pow(pi2,2) + pow(pr1,2) - pow(pr2,2)) + (pow(pi1,2) + pow(pr1,2))*(pow(pi1,2) - pow(pi2,2) + (pr1 - pr2)*(2*p0 - 3*pr1 + pr2))) +
           k6*(-pow(pi1,4) + pow(pi1,2)*(pow(pi2,2) - 2*pow(pr1,2) + 2*p0*pr2 + pow(pr2,2)) + pr1*(pr1*(pow(pi2,2) - pow(pr1,2) + pow(pr2,2)) - 2*p0*(pow(pi2,2) - pr1*pr2 + pow(pr2,2))))) +
        k3*(-((pow(pi1,2) + pow(pr1,2))*(4*pow(pi1,2)*pr1 - 2*pow(pi2,2)*pr1 - 4*pow(pr1,3) - 2*pow(pi1,2)*pr2 + 6*pow(pr1,2)*pr2 - 2*pr1*pow(pr2,2) + p0*(-pow(pi1,2) + pow(pi2,2) + 3*pow(pr1,2) - 4*pr1*pr2 + pow(pr2,2)) +
                k6*(-pow(pi1,2) + pow(pi2,2) - (pr1 - pr2)*(2*p0 - 3*pr1 + pr2)))) + k5*(-pow(pi1,4) + pow(pi1,2)*(pow(pi2,2) - 4*p0*pr1 + 10*pow(pr1,2) + 2*p0*pr2 - 8*pr1*pr2 + pow(pr2,2)) +
              k6*(2*pow(pi1,2)*(-2*pr1 + pr2) + p0*(pow(pi1,2) - pow(pi2,2) - 3*pow(pr1,2) + 4*pr1*pr2 - pow(pr2,2)) + 2*pr1*(pow(pi2,2) + 2*pow(pr1,2) - 3*pr1*pr2 + pow(pr2,2))) +
              pr1*(2*p0*(pow(pi2,2) + 2*pow(pr1,2) - 3*pr1*pr2 + pow(pr2,2)) - pr1*(3*pow(pi2,2) + 5*pow(pr1,2) - 8*pr1*pr2 + 3*pow(pr2,2)))) +
           k4*(2*k6*(pow(pi1,2) + pow(pr1,2))*(pr1 - pr2) + k6*p0*(-pow(pi1,2) + pow(pi2,2) - pow(pr1,2) + pow(pr2,2)) + (pow(pi1,2) + pow(pr1,2))*(pow(pi1,2) - pow(pi2,2) + (pr1 - pr2)*(2*p0 - 3*pr1 + pr2)) +
              k5*(2*pow(pi1,2)*(-2*pr1 + pr2) + p0*(pow(pi1,2) - pow(pi2,2) - 3*pow(pr1,2) + 4*pr1*pr2 - pow(pr2,2)) + 2*pr1*(pow(pi2,2) + 2*pow(pr1,2) - 3*pr1*pr2 + pow(pr2,2)) +
                 k6*(pow(pi1,2) - pow(pi2,2) + (pr1 - pr2)*(2*p0 - 3*pr1 + pr2))))))*cos(pi1*t) -
     ((pow(pi1,2) + pow(pr1,2))*((pow(pi1,2) + pow(pr1,2))*(p0*(pow(pi1,2) - pow(pi2,2) - pow(pr1 - pr2,2)) + pr1*(pow(pi2,2) + pow(pr1 - pr2,2)) + pow(pi1,2)*(-3*pr1 + 2*pr2)) +
           k6*(pow(pi1,4) + (p0 - pr1)*pr1*(pow(pi2,2) + pow(pr1 - pr2,2)) - pow(pi1,2)*(pow(pi2,2) - p0*pr1 + 2*p0*pr2 - 2*pr1*pr2 + pow(pr2,2))) +
           k5*(-pow(pi1,4) + (p0 - pr1)*pr1*(pow(pi2,2) + pow(pr1 - pr2,2)) + pow(pi1,2)*(pow(pi2,2) - 3*p0*pr1 + 6*pow(pr1,2) + 2*p0*pr2 - 6*pr1*pr2 + pow(pr2,2)) +
              k6*(p0*(pow(pi1,2) - pow(pi2,2) - pow(pr1 - pr2,2)) + pr1*(pow(pi2,2) + pow(pr1 - pr2,2)) + pow(pi1,2)*(-3*pr1 + 2*pr2)))) +
        k4*((pow(pi1,2) + pow(pr1,2))*(pow(pi1,4) + (p0 - pr1)*pr1*(pow(pi2,2) + pow(pr1 - pr2,2)) - pow(pi1,2)*(pow(pi2,2) - p0*pr1 + 2*p0*pr2 - 2*pr1*pr2 + pow(pr2,2))) +
           k5*((pow(pi1,2) + pow(pr1,2))*(p0*(pow(pi1,2) - pow(pi2,2) - pow(pr1 - pr2,2)) + pr1*(pow(pi2,2) + pow(pr1 - pr2,2)) + pow(pi1,2)*(-3*pr1 + 2*pr2)) +
              k6*(pow(pi1,4) + (p0 - pr1)*pr1*(pow(pi2,2) + pow(pr1 - pr2,2)) - pow(pi1,2)*(pow(pi2,2) - p0*pr1 + 2*p0*pr2 - 2*pr1*pr2 + pow(pr2,2)))) +
           k6*((pow(pi1,2) + pow(pr1,2))*(pr1*(pow(pi2,2) + pow(pr1 - pr2,2)) + pow(pi1,2)*(pr1 - 2*pr2)) -
              p0*(pow(pi1,4) + pow(pr1,2)*(pow(pi2,2) + pow(pr1 - pr2,2)) - pow(pi1,2)*(pow(pi2,2) - 2*pow(pr1,2) + 2*pr1*pr2 + pow(pr2,2))))) +
        k3*((pow(pi1,2) + pow(pr1,2))*(-pow(pi1,4) + (p0 - pr1)*pr1*(pow(pi2,2) + pow(pr1 - pr2,2)) + pow(pi1,2)*(pow(pi2,2) - 3*p0*pr1 + 6*pow(pr1,2) + 2*p0*pr2 - 6*pr1*pr2 + pow(pr2,2)) +
              k6*(p0*(pow(pi1,2) - pow(pi2,2) - pow(pr1 - pr2,2)) + pr1*(pow(pi2,2) + pow(pr1 - pr2,2)) + pow(pi1,2)*(-3*pr1 + 2*pr2))) +
           k5*(5*pow(pi1,4)*pr1 - 3*pow(pi1,2)*pow(pi2,2)*pr1 - 10*pow(pi1,2)*pow(pr1,3) + pow(pi2,2)*pow(pr1,3) + pow(pr1,5) - 2*pow(pi1,4)*pr2 + 12*pow(pi1,2)*pow(pr1,2)*pr2 - 2*pow(pr1,4)*pr2 - 3*pow(pi1,2)*pr1*pow(pr2,2) +
              pow(pr1,3)*pow(pr2,2) - p0*(pow(pi1,4) + pow(pr1,2)*(pow(pi2,2) + pow(pr1 - pr2,2)) - pow(pi1,2)*(pow(pi2,2) + 6*pow(pr1,2) - 6*pr1*pr2 + pow(pr2,2))) +
              k6*(-pow(pi1,4) + (p0 - pr1)*pr1*(pow(pi2,2) + pow(pr1 - pr2,2)) + pow(pi1,2)*(pow(pi2,2) - 3*p0*pr1 + 6*pow(pr1,2) + 2*p0*pr2 - 6*pr1*pr2 + pow(pr2,2)))) +
           k4*((pow(pi1,2) + pow(pr1,2))*(p0*(pow(pi1,2) - pow(pi2,2) - pow(pr1 - pr2,2)) + pr1*(pow(pi2,2) + pow(pr1 - pr2,2)) + pow(pi1,2)*(-3*pr1 + 2*pr2)) +
              k6*(pow(pi1,4) + (p0 - pr1)*pr1*(pow(pi2,2) + pow(pr1 - pr2,2)) - pow(pi1,2)*(pow(pi2,2) - p0*pr1 + 2*p0*pr2 - 2*pr1*pr2 + pow(pr2,2))) +
              k5*(-pow(pi1,4) + (p0 - pr1)*pr1*(pow(pi2,2) + pow(pr1 - pr2,2)) + pow(pi1,2)*(pow(pi2,2) - 3*p0*pr1 + 6*pow(pr1,2) + 2*p0*pr2 - 6*pr1*pr2 + pow(pr2,2)) +
                 k6*(p0*(pow(pi1,2) - pow(pi2,2) - pow(pr1 - pr2,2)) + pr1*(pow(pi2,2) + pow(pr1 - pr2,2)) + pow(pi1,2)*(-3*pr1 + 2*pr2))))))*sin(pi1*t))/
    (exp(pr1*t)*pi1*(pow(k4,2) + pow(pi1,2) - 2*k4*pr1 + pow(pr1,2))*(pow(k6,2) + pow(pi1,2) - 2*k6*pr1 + pow(pr1,2))*(pow(p0,2) + pow(pi1,2) - 2*p0*pr1 + pow(pr1,2))*
     (pow(pi1,4) - 2*pow(pi1,2)*(pow(pi2,2) - pow(pr1 - pr2,2)) + pow(pow(pi2,2) + pow(pr1 - pr2,2),2))) +
  (-(pi2*(k4*(-((pow(pi2,2) + pow(pr2,2))*(p0*(pow(pi1,2) - pow(pi2,2) + pow(pr1,2) - pow(pr2,2)) - 2*(pr1 - pr2)*(pow(pi2,2) + pow(pr2,2)))) +
             k5*((pow(pi1,2) - pow(pi2,2) + (2*p0 + pr1 - 3*pr2)*(pr1 - pr2))*(pow(pi2,2) + pow(pr2,2)) + 2*k6*(pr1 - pr2)*(pow(pi2,2) + pow(pr2,2)) + k6*p0*(-pow(pi1,2) + pow(pi2,2) - pow(pr1,2) + pow(pr2,2))) +
             k6*(pow(pi2,4) - pow(pi2,2)*(2*p0*pr1 + pow(pr1,2) - 2*pow(pr2,2)) - pow(pi1,2)*(pow(pi2,2) + pr2*(-2*p0 + pr2)) - (pr1 - pr2)*pr2*(-2*p0*pr1 + pr2*(pr1 + pr2)))) +
          (pow(pi2,2) + pow(pr2,2))*((pow(pi1,2) - pow(pi2,2) + (2*p0 + pr1 - 3*pr2)*(pr1 - pr2))*(pow(pi2,2) + pow(pr2,2)) + 2*k6*(pr1 - pr2)*(pow(pi2,2) + pow(pr2,2)) + k6*p0*(-pow(pi1,2) + pow(pi2,2) - pow(pr1,2) + pow(pr2,2)) +
             k5*(k6*(pow(pi1,2) - pow(pi2,2) + (2*p0 + pr1 - 3*pr2)*(pr1 - pr2)) + p0*(pow(pi1,2) - pow(pi2,2) + pow(pr1,2) - 4*pr1*pr2 + 3*pow(pr2,2)) -
                2*(pow(pi2,2)*(pr1 - 2*pr2) + pr2*(pow(pi1,2) + pow(pr1,2) - 3*pr1*pr2 + 2*pow(pr2,2))))) +
          k3*((pow(pi2,2) + pow(pr2,2))*(k6*(pow(pi1,2) - pow(pi2,2) + (2*p0 + pr1 - 3*pr2)*(pr1 - pr2)) + p0*(pow(pi1,2) - pow(pi2,2) + pow(pr1,2) - 4*pr1*pr2 + 3*pow(pr2,2)) -
                2*(pow(pi2,2)*(pr1 - 2*pr2) + pr2*(pow(pi1,2) + pow(pr1,2) - 3*pr1*pr2 + 2*pow(pr2,2)))) +
             k5*(pow(pi2,4) - 2*p0*pow(pi2,2)*pr1 - pow(pi2,2)*pow(pr1,2) + 4*p0*pow(pi2,2)*pr2 + 8*pow(pi2,2)*pr1*pr2 - 2*p0*pow(pr1,2)*pr2 - 10*pow(pi2,2)*pow(pr2,2) + 6*p0*pr1*pow(pr2,2) + 3*pow(pr1,2)*pow(pr2,2) -
                4*p0*pow(pr2,3) - 8*pr1*pow(pr2,3) + 5*pow(pr2,4) - pow(pi1,2)*(pow(pi2,2) + (2*p0 - 3*pr2)*pr2) + k6*p0*(pow(pi1,2) - pow(pi2,2) + pow(pr1,2) - 4*pr1*pr2 + 3*pow(pr2,2)) -
                2*k6*(pow(pi2,2)*(pr1 - 2*pr2) + pr2*(pow(pi1,2) + pow(pr1,2) - 3*pr1*pr2 + 2*pow(pr2,2)))) +
             k4*((pow(pi1,2) - pow(pi2,2) + (2*p0 + pr1 - 3*pr2)*(pr1 - pr2))*(pow(pi2,2) + pow(pr2,2)) + 2*k6*(pr1 - pr2)*(pow(pi2,2) + pow(pr2,2)) + k6*p0*(-pow(pi1,2) + pow(pi2,2) - pow(pr1,2) + pow(pr2,2)) +
                k5*(k6*(pow(pi1,2) - pow(pi2,2) + (2*p0 + pr1 - 3*pr2)*(pr1 - pr2)) + p0*(pow(pi1,2) - pow(pi2,2) + pow(pr1,2) - 4*pr1*pr2 + 3*pow(pr2,2)) -
                   2*(pow(pi2,2)*(pr1 - 2*pr2) + pr2*(pow(pi1,2) + pow(pr1,2) - 3*pr1*pr2 + 2*pow(pr2,2)))))))*cos(pi2*t)) +
     ((pow(pi2,2) + pow(pr2,2))*((pow(pi2,2) + pow(pr2,2))*(p0*(pow(pi1,2) - pow(pi2,2) + pow(pr1 - pr2,2)) - (pow(pi1,2) + pow(pr1 - pr2,2))*pr2 + pow(pi2,2)*(-2*pr1 + 3*pr2)) +
           k6*(-pow(pi2,4) - (p0 - pr2)*pow(pr1 - pr2,2)*pr2 + pow(pi2,2)*(2*p0*pr1 + pow(pr1,2) - p0*pr2 - 2*pr1*pr2) + pow(pi1,2)*(pow(pi2,2) + pr2*(-p0 + pr2))) +
           k5*(-(pow(pi1,2)*pow(pi2,2)) + pow(pi2,4) - 2*p0*pow(pi2,2)*pr1 - pow(pi2,2)*pow(pr1,2) - p0*pow(pi1,2)*pr2 + 3*p0*pow(pi2,2)*pr2 + 6*pow(pi2,2)*pr1*pr2 - p0*pow(pr1,2)*pr2 + pow(pi1,2)*pow(pr2,2) -
              6*pow(pi2,2)*pow(pr2,2) + 2*p0*pr1*pow(pr2,2) + pow(pr1,2)*pow(pr2,2) - p0*pow(pr2,3) - 2*pr1*pow(pr2,3) + pow(pr2,4) +
              k6*(p0*(pow(pi1,2) - pow(pi2,2) + pow(pr1 - pr2,2)) - (pow(pi1,2) + pow(pr1 - pr2,2))*pr2 + pow(pi2,2)*(-2*pr1 + 3*pr2)))) +
        k4*(-(k6*(pow(pi2,2) + pow(pr2,2))*((pow(pi1,2) + pow(pr1 - pr2,2))*pr2 + pow(pi2,2)*(-2*pr1 + pr2))) +
           k6*p0*(pow(pi2,4) + pow(pr1 - pr2,2)*pow(pr2,2) - pow(pi2,2)*(pow(pr1,2) + 2*pr1*pr2 - 2*pow(pr2,2)) + pow(pi1,2)*(-pow(pi2,2) + pow(pr2,2))) +
           (pow(pi2,2) + pow(pr2,2))*(-pow(pi2,4) - (p0 - pr2)*pow(pr1 - pr2,2)*pr2 + pow(pi2,2)*(2*p0*pr1 + pow(pr1,2) - p0*pr2 - 2*pr1*pr2) + pow(pi1,2)*(pow(pi2,2) + pr2*(-p0 + pr2))) +
           k5*((pow(pi2,2) + pow(pr2,2))*(p0*(pow(pi1,2) - pow(pi2,2) + pow(pr1 - pr2,2)) - (pow(pi1,2) + pow(pr1 - pr2,2))*pr2 + pow(pi2,2)*(-2*pr1 + 3*pr2)) +
              k6*(-pow(pi2,4) - (p0 - pr2)*pow(pr1 - pr2,2)*pr2 + pow(pi2,2)*(2*p0*pr1 + pow(pr1,2) - p0*pr2 - 2*pr1*pr2) + pow(pi1,2)*(pow(pi2,2) + pr2*(-p0 + pr2))))) +
        k3*((pow(pi2,2) + pow(pr2,2))*(-(pow(pi1,2)*pow(pi2,2)) + pow(pi2,4) - 2*p0*pow(pi2,2)*pr1 - pow(pi2,2)*pow(pr1,2) - p0*pow(pi1,2)*pr2 + 3*p0*pow(pi2,2)*pr2 + 6*pow(pi2,2)*pr1*pr2 - p0*pow(pr1,2)*pr2 +
              pow(pi1,2)*pow(pr2,2) - 6*pow(pi2,2)*pow(pr2,2) + 2*p0*pr1*pow(pr2,2) + pow(pr1,2)*pow(pr2,2) - p0*pow(pr2,3) - 2*pr1*pow(pr2,3) + pow(pr2,4) +
              k6*(p0*(pow(pi1,2) - pow(pi2,2) + pow(pr1 - pr2,2)) - (pow(pi1,2) + pow(pr1 - pr2,2))*pr2 + pow(pi2,2)*(-2*pr1 + 3*pr2))) -
           k5*(p0*pow(pi1,2)*pow(pi2,2) - p0*pow(pi2,4) - 2*pow(pi2,4)*pr1 + p0*pow(pi2,2)*pow(pr1,2) - 3*pow(pi1,2)*pow(pi2,2)*pr2 + 5*pow(pi2,4)*pr2 - 6*p0*pow(pi2,2)*pr1*pr2 - 3*pow(pi2,2)*pow(pr1,2)*pr2 -
              p0*pow(pi1,2)*pow(pr2,2) + 6*p0*pow(pi2,2)*pow(pr2,2) + 12*pow(pi2,2)*pr1*pow(pr2,2) - p0*pow(pr1,2)*pow(pr2,2) + pow(pi1,2)*pow(pr2,3) - 10*pow(pi2,2)*pow(pr2,3) + 2*p0*pr1*pow(pr2,3) + pow(pr1,2)*pow(pr2,3) -
              p0*pow(pr2,4) - 2*pr1*pow(pr2,4) + pow(pr2,5) + k6*(-pow(pi2,4) + (p0 - pr2)*pow(pr1 - pr2,2)*pr2 + pow(pi1,2)*(pow(pi2,2) + (p0 - pr2)*pr2) + pow(pi2,2)*(2*p0*pr1 + pow(pr1,2) - 3*p0*pr2 - 6*pr1*pr2 + 6*pow(pr2,2)))) +
           k4*((pow(pi2,2) + pow(pr2,2))*(p0*(pow(pi1,2) - pow(pi2,2) + pow(pr1 - pr2,2)) - (pow(pi1,2) + pow(pr1 - pr2,2))*pr2 + pow(pi2,2)*(-2*pr1 + 3*pr2)) +
              k6*(-pow(pi2,4) - (p0 - pr2)*pow(pr1 - pr2,2)*pr2 + pow(pi2,2)*(2*p0*pr1 + pow(pr1,2) - p0*pr2 - 2*pr1*pr2) + pow(pi1,2)*(pow(pi2,2) + pr2*(-p0 + pr2))) +
              k5*(-(pow(pi1,2)*pow(pi2,2)) + pow(pi2,4) - 2*p0*pow(pi2,2)*pr1 - pow(pi2,2)*pow(pr1,2) - p0*pow(pi1,2)*pr2 + 3*p0*pow(pi2,2)*pr2 + 6*pow(pi2,2)*pr1*pr2 - p0*pow(pr1,2)*pr2 + pow(pi1,2)*pow(pr2,2) -
                 6*pow(pi2,2)*pow(pr2,2) + 2*p0*pr1*pow(pr2,2) + pow(pr1,2)*pow(pr2,2) - p0*pow(pr2,3) - 2*pr1*pow(pr2,3) + pow(pr2,4) +
                 k6*(p0*(pow(pi1,2) - pow(pi2,2) + pow(pr1 - pr2,2)) - (pow(pi1,2) + pow(pr1 - pr2,2))*pr2 + pow(pi2,2)*(-2*pr1 + 3*pr2))))))*sin(pi2*t))/
    (exp(pr2*t)*pi2*(pow(pi1,4) - 2*pow(pi1,2)*(pow(pi2,2) - pow(pr1 - pr2,2)) + pow(pow(pi2,2) + pow(pr1 - pr2,2),2))*(pow(k4,2) + pow(pi2,2) - 2*k4*pr2 + pow(pr2,2))*(pow(k6,2) + pow(pi2,2) - 2*k6*pr2 + pow(pr2,2))*
    (pow(p0,2) + pow(pi2,2) - 2*p0*pr2 + pow(pr2,2))));

    if (t > 0) {
      return value;
    } else {
      return 0;
    }
  }

  {/*Convert response legacy to javascript */}
  function responseLegacy(x, par) {
    // const t = x.map(val => val - par[0]);
    const t = x - par[0];
    const A0 = par[1];
    const tp = par[2];

    // const reltime = t.map(val => val / tp);
    const reltime = t/tp;
    const gain = A0 * 1.012;
    // console.log("x", x);
    // console.log("t", t);
    // console.log("A0", A0);
    // console.log("tp", tp);
    // console.log("reltime", reltime);
    // console.log("gain", gain);
    // console.log("params", par);
    const value = 4.31054 * Math.exp(-2.94809 * reltime) * gain -
      2.6202 * Math.exp(-2.82833 * reltime) * Math.cos(1.19361 * reltime) * gain -
      2.6202 * Math.exp(-2.82833 * reltime) * Math.cos(1.19361 * reltime) * Math.cos(2.38722 * reltime) * gain +
      0.464924 * Math.exp(-2.40318 * reltime) * Math.cos(2.5928 * reltime) * gain +
      0.464924 * Math.exp(-2.40318 * reltime) * Math.cos(2.5928 * reltime) * Math.cos(5.18561 * reltime) * gain +
      0.762456 * Math.exp(-2.82833 * reltime) * Math.sin(1.19361 * reltime) * gain -
      0.762456 * Math.exp(-2.82833 * reltime) * Math.cos(2.38722 * reltime) * Math.sin(1.19361 * reltime) * gain +
      0.762456 * Math.exp(-2.82833 * reltime) * Math.cos(1.19361 * reltime) * Math.sin(2.38722 * reltime) * gain -
      2.6202 * Math.exp(-2.82833 * reltime) * Math.sin(1.19361 * reltime) * Math.sin(2.38722 * reltime) * gain -
      0.327684 * Math.exp(-2.40318 * reltime) * Math.sin(2.5928 * reltime) * gain +
      0.327684 * Math.exp(-2.40318 * reltime) * Math.cos(5.18561 * reltime) * Math.sin(2.5928 * reltime) * gain -
      0.327684 * Math.exp(-2.40318 * reltime) * Math.cos(2.5928 * reltime) * Math.sin(5.18561 * reltime) * gain +
      0.464924 * Math.exp(-2.40318 * reltime) * Math.sin(2.5928 * reltime) * Math.sin(5.18561 * reltime) * gain;

    return t>0 ? value : 0;
  }

  // Helper function for trapezoidal integration
  function trapezoidalIntegration(x, y) {
    let integral = 0;
    for (let i = 0; i < x.length - 1; i++) {
      integral += 0.5 * (x[i + 1] - x[i]) * (y[i] + y[i + 1]);
    }
    return integral;
  }

  // Calculate the integral of the tail and the maximum deviation of the tail of the real response from the ideal
  function calculateMetrics(params) {
    const x = generateX();
    const R = x.map(val => response(val, params));
    // x = generateX();
    const R_ideal = x.map(val => responseLegacy(val, params));

    // Find the peak in the ideal response
    const pos_peak = R_ideal.indexOf(Math.max(...R_ideal));

    // Define the tail region
    const xtail = x.slice(pos_peak + 6);
    const y1 = R.slice(pos_peak + 6);
    const y2 = R_ideal.slice(pos_peak + 6);

    // Select data for integration
    const x_selected = xtail.slice(0, 50); // Fixed integration domain
    const R_selected = y1.slice(0, 50);
    const R_ideal_selected = y2.slice(0, 50);

    // Calculate integrals using the trapezoidal rule
    const integral_R_selected = trapezoidalIntegration(x_selected, R_selected);
    const integral_R_ideal_selected = trapezoidalIntegration(x_selected, R_ideal_selected);

    // Calculate deviations
    const deviations = R_selected.map((val, i) => val - R_ideal_selected[i]);
    const max_deviation = Math.max(...deviations.map(Math.abs));

    return {
      integralOfTail: integral_R_selected.toFixed(2),
      maxDeviation: max_deviation.toFixed(2),
      responseClass: "Unknown" // Placeholder for now
    };
  }

  useEffect(() => {
    const x = generateX();
    const y = x.map(val => response(val, params));
    const yIdeal = x.map(val => responseLegacy(val, params)); // Calculate the ideal response
    console.log("yIdeal", yIdeal);
    console.log("x", x);
    setDataPoints({ x, y, yIdeal }); // Store both response and ideal response
  }, [params]); // Recalculate when params change

  const handleChange = (index, event) => {
    const newValue = parseFloat(event.target.value);
    if (selectedOverlayIndex === null) {
      const newParams = [...params];
      newParams[index] = newValue;
      setParams(newParams);
    } else {
      const newOverlayData = [...overlayData];
      const selectedOverlay = newOverlayData[selectedOverlayIndex];
      const x = selectedOverlay.x;
      const newParams = [...params];
      newParams[index] = newValue;
      const newY = x.map(val => response(val, newParams));
      newOverlayData[selectedOverlayIndex] = { x, y: newY };
      setOverlayData(newOverlayData);
    }
  };


  const handleInputChange = (index, event) => {
    const newValue = Number(event.target.value);
    if (selectedOverlayIndex === null) {
      const newParams = [...params];
      newParams[index] = newValue;
      setParams(newParams);
    } else {
      const newOverlayData = [...overlayData];
      const selectedOverlay = newOverlayData[selectedOverlayIndex];
      const x = selectedOverlay.x;
      const newParams = [...params];
      newParams[index] = newValue;
      const newY = x.map(val => response(val, newParams));
      newOverlayData[selectedOverlayIndex] = { x, y: newY };
      setOverlayData(newOverlayData);
    }
  };

  const addOverlay = () => {
    setOverlayData([...overlayData, { ...dataPoints, params: [...params] }]);
  };

  const downloadCSV = () => {
    const { x, y } = dataPoints;
    const csv = ['time,response', ...x.map((t, i) => `${t},${y[i]}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'response_curve.csv';
    a.click();
  };

  const sliders = [
    { label: 't₀', min: 4.6, max: 5.5, step: 0.01 },
    { label: 'A₀', min: 0, max: 100000, step: 1000 },
    { label: 'tₚ', min: 1.9, max: 2.3, step: 0.01 },
    { label: 'k₃', min: -10, max: 10, step: 0.01 },
    { label: 'k₄', min: -10, max: 10, step: 0.01 },
    { label: 'k₅', min: -10, max: 10, step: 0.01 },
    { label: 'k₆', min: -10, max: 10, step: 0.01 },
  ];

  const chartData = {
    datasets: [
      {
        label: 'Response Curve',
        data: dataPoints.x.map((x, i) => ({ x, y: dataPoints.y[i] })), // ✅ PAIRS!
        borderColor: 'red',
        borderWidth: 2,
        tension: 0,
        pointRadius: 0,
        fill: false,
      },
      {
        label: 'Ideal Response Curve',
        data: dataPoints.x.map((x, i) => ({ x, y: dataPoints.yIdeal[i] })), // Ideal response curve
        borderColor: 'blue',
        borderWidth: 2,
        tension: 0,
        pointRadius: 0,
        fill: false,
        borderDash: [5, 5], // Dashed line for distinction
      },
      ...overlayData.map((set, i) => ({
        label: `Overlay ${i + 1}`,
        data: set.x.map((x, j) => ({ x, y: set.y[j] })), // ✅ overlay with pairs too
        borderColor: `hsl(${(i * 50 + 120) % 360}, 70%, 50%)`,
        borderWidth: selectedOverlayIndex === i ? 3 : 1,
        pointRadius: 0,
        tension: 0,
        fill: false,
      }))
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: {
        display: true,
        text: 'Response Function Value vs. Time'
      }
    },
    scales: {
      x: {
        type: 'linear',
        title: {
          display: true,
          text: 'Time (microseconds)'
        },
        ticks: {
          callback: function(value) {
            return value.toFixed(1);
          }
        }
      },
      y: {
        title: {
          display: true,
          text: 'ADC counts'
        },
        grid: {
          drawBorder: true,
          drawTicks: true,
          drawOnChartArea: true,
          color: (ctx) => {
            if (showZeroLine && ctx.tick.value === 0) return 'black';
            return 'rgba(200,200,200,0.3)';
          },
          lineWidth: (ctx) => (showZeroLine && ctx.tick.value === 0 ? 1.5 : 0.5),
          borderDash: (ctx) => (showZeroLine && ctx.tick.value === 0 ? [8, 4] : []),
        }
      }
    }
  };

  // Adding a button allowing to input the fit parameters by copying them from a csv (comma separated) file
  const [showInputModal, setShowInputModal] = useState(false);
  const [inputValues, setInputValues] = useState('');

  const applyInputValues = () => {
    const values = inputValues.split(',').map(Number);
    if (values.length === 6) {
      const newParams = [...params];
      [newParams[1], newParams[2], newParams[3], newParams[4], newParams[5], newParams[6]] = values;
      setParams(newParams);
      setShowInputModal(false);
    } else {
      alert('Please enter exactly 6 comma-separated values.');
    }
  };

  // Adding a table, below the button Past parameters, showing the integral, max deviation, and class of the response function
  const [responseMetrics, setResponseMetrics] = useState({
    integralOfTail: 'Unknown',
    maxDeviation: 'Unknown',
    responseClass: 'Unknown',
  });
  useEffect(() => {
    const x = generateX();
    const y = x.map(val => response(val, params));
    const yIdeal = x.map(val => responseLegacy(val, params)); // Calculate the ideal response
    setDataPoints({ x, y, yIdeal });

    // Calculate metrics
    const metrics = calculateMetrics(params);
    setResponseMetrics(metrics);
  }, [params]); // Recalculate when params change

  // Return
  return (
    <div style={{
      padding: '30px',
      backgroundColor: '#f8f9fa',
      borderRadius: '10px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
    }}>
      <h2 style={{
        marginBottom: '20px',
        textAlign: 'center',
        color: '#343a40',
      }}>Electronics Response Function Visualizer</h2>
      <div style={{ display: 'flex', overflow: 'auto' }}>
        <div style={{ flex: 1, overflowX: 'auto' }}>
          <Line data={chartData} options={chartOptions} />
        </div>

        <div style={{
          width: '300px',
          flexShrink: 0,
          paddingLeft: '20px',
          borderLeft: '1px solid #ced4da',
          maxHeight: '80vh',
          overflowY: 'auto'
        }}>
          <select
            value={selectedOverlayIndex === null ? 'default' : selectedOverlayIndex}
            onChange={(e) => setSelectedOverlayIndex(e.target.value === 'default' ? null : parseInt(e.target.value))}
            style={{ marginBottom: '10px', width: '100%', padding: '5px', borderRadius: '5px' }}
          >
            <option value="default">Base Curve</option>
            {overlayData.map((_, index) => (
              <option key={index} value={index}>Overlay {index + 1}</option>
            ))}
          </select>
          {sliders.map((s, i) => (
            <div key={i} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
              <label style={{
                width: '30px',
                fontWeight: 'bold',
                color: '#495057',
                marginRight: '5px'
              }}>{s.label}:</label>
              <input
                type='number'
                value={selectedOverlayIndex === null ? params[i] : overlayData[selectedOverlayIndex].params ? overlayData[selectedOverlayIndex].params[i] : params[i]}
                step={s.step}
                min={s.min}
                max={s.max}
                onChange={(e) => handleInputChange(i, e)}
                style={{
                  width: '70px',
                  padding: '5px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  marginRight: '5px'
                }}
              />
              <input
                type='range'
                min={s.min}
                max={s.max}
                step={s.step}
                value={selectedOverlayIndex === null ? params[i] : overlayData[selectedOverlayIndex].params ? overlayData[selectedOverlayIndex].params[i] : params[i]}
                onChange={(e) => handleChange(i, e)}
                style={{ width: 'calc(100% - 110px)' }}
              />
            </div>
          ))}
          <div style={{ display: 'flex', marginBottom: '10px' }}>
            <button onClick={addOverlay} style={{
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              marginRight: '10px'
            }}>Add a curve</button>
            <button onClick={downloadCSV} style={{
              backgroundColor: '#28a745',
              color: '#fff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}>Download CSV</button>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <label style={{ color: '#495057' }}>
              <input
                type="checkbox"
                checked={showZeroLine}
                onChange={(e) => setShowZeroLine(e.target.checked)}
              />
              Show zero line
            </label>
          </div>
          
            <div style={{ display: 'flex', marginBottom: '10px' }}>
              <button onClick={() => setShowInputModal(true)} style={{
                backgroundColor: '#0000ff',
                color: '#fff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer'
              }}>Input Parameters</button>
            </div>

            {showInputModal && (
              <div style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: '#fff',
                padding: '20px',
                borderRadius: '10px',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
                zIndex: 1000
              }}>
                <h4 style={{ marginBottom: '10px' }}>Paste Parameters (A₀, tₚ, k₃, k₄, k₅, k₆)</h4>
                <textarea
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ced4da',
                    borderRadius: '5px',
                    marginBottom: '10px'
                  }}
                  placeholder="e.g. 75000,2.2,0.1,0.1,0.03,0.03"
                  value={inputValues}
                  onChange={(e) => setInputValues(e.target.value)}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button onClick={applyInputValues} style={{
                    backgroundColor: '#28a745',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}>Apply</button>
                  {/*Add a clear button */}
                  <button onClick={() => setInputValues('')} style={{
                    backgroundColor: '#0f0f0f',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}>Clear</button>
                  <button onClick={() => setShowInputModal(false)} style={{
                    backgroundColor: '#dc3545',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}>Cancel</button>
                </div>
              </div>
            )}

          {/*Adding the table showing the integral, max deviation, and class*/}
          {/* Table for response metrics */}
          <div style={{
            marginTop: '20px',
            border: '1px solid #ced4da',
            borderRadius: '5px',
            padding: '10px',
            backgroundColor: '#fff',
            boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)'
          }}>
            <h5 style={{ marginBottom: '10px', color: '#495057' }}>Response Metrics</h5>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ced4da' }}>Metric</th>
                  <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ced4da' }}>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '8px', borderBottom: '1px solid #ced4da' }}>Integral of Tail</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #ced4da' }}>{responseMetrics.integralOfTail}</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px', borderBottom: '1px solid #ced4da' }}>Maximum Deviation</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #ced4da' }}>{responseMetrics.maxDeviation}</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px' }}>Response Class</td>
                  <td style={{ padding: '8px' }}>{responseMetrics.responseClass}</td>
                </tr>
              </tbody>
            </table>
          </div>          

        </div>
      </div>
    </div>
  );
}
 
export default App;
