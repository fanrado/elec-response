import 'bootstrap/dist/css/bootstrap.min.css';
// A Plotly-based React app to explore the 'response' function with 7 parameters using backend API
import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Legend
} from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale, Legend, annotationPlugin);

function App() {

  const [params, setParams] = useState([5, 75000, 2.2, 0.1, 0.1, 0.03, 0.03]); // t, A0, t_p, k3, k4, k5, k6
  const [dataPoints, setDataPoints] = useState({ x: [], y: [] });
  // const [overlayData, setOverlayData] = useState([]);
  const [showZeroLine, setShowZeroLine] = useState(true);
  // const [selectedOverlayIndex, setSelectedOverlayIndex] = useState(null);
  const [dataId, setDataId] = useState(''); // State to store the data_id

  // add a new state for pos_peak
  const [posPeak, setPosPeak] = useState(null);
  const [tailOffset, setTailOffset] = useState(4); // Default value is 6

  const generateX = () => Array.from({ length: 5000 }, (_, i) => i * 0.01); // 0 to 50 us
  // const generateX = () => Array.from({ length: 70 }, (_, i) => i * 1); // 0 to 50 us

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

  // {/*Convert response legacy to javascript */}
  function responseLegacy(x, par) {
    // const t = x.map(val => val - par[0]);
    const t = x - par[0];
    const A0 = par[1];
    const tp = par[2];

    // const reltime = t.map(val => val / tp);
    const reltime = t/tp;
    const gain = A0 * 1.012;

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

  useEffect(() => {
    const x = generateX();
    const y = x.map(val => response(val, params));
    const yIdeal = x.map(val => responseLegacy(val, params)); // Calculate the ideal response
    setDataPoints({ x, y, yIdeal }); // Store both response and ideal response
  }, [params]); // Recalculate when params change


  // fetch the data
  const fetchDataById = async (data_id) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/data/${data_id}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data from the API');
      }

      const data = await response.json();
      // console.log(data);
      // t, A0, t_p, k3, k4, k5, k6
      setParams([data.t, data.A_0, data.t_p, data.k3, data.k4, data.k5, data.k6]);
      // console.log(params);
      // setDataPoints({ x: data.x, y: data.y }); // Update the dataPoints state with the API response
      setResponseMetrics({
        integralOfTail: Math.round(data.integral_R*10000, 4)/10000,
        maxDeviation: Math.round(data.max_deviation*10000, 4)/10000,
        responseClass: data.class
      })
    } catch (error) {
      console.error('Error fetching data from API:', error);
    }
  };

  //
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
      // ...overlayData.map((set, i) => ({
      //   label: `Overlay ${i + 1}`,
      //   data: set.x.map((x, j) => ({ x, y: set.y[j] })), // ✅ overlay with pairs too
      //   borderColor: `hsl(${(i * 50 + 120) % 360}, 70%, 50%)`,
      //   borderWidth: selectedOverlayIndex === i ? 3 : 1,
      //   pointRadius: 0,
      //   tension: 0,
      //   fill: false,
      // }))
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: {
        display: true,
        text: 'Response Function Value vs. Time'
      },
      // // Draw a rectangle highlighting the region selected for the calculation of the integral of the tail ------------- MIGHT BE USEFUL FOR VISUALIZATION
      // annotation: {
      //   annotations: {
      //     tailRegion: posPeak != null && {
      //       type: 'box',
      //       // xMin: dataPoints.x[posPeak + 6], // Start of the tail region
      //       // xMax: dataPoints.x[posPeak + 70], // End of the tail region
      //       // yMin: Math.min(...dataPoints.y), // Minimum y-value
      //       // // yMax: Math.max(...dataPoints.y), // Maximum y-value
      //       // yMax: Math.max(...dataPoints.y.slice(posPeak + 6)), // Maximum y-value from posPeak + 6
      //       xMin: dataPoints.x[posPeak + tailOffset / 0.01], // Start of the tail region
      //       xMax: dataPoints.x[posPeak + (tailOffset + 50) / 0.01], // End of the tail region
      //       yMin: Math.min(...dataPoints.y), // Minimum y-value
      //       yMax: Math.max(...dataPoints.y.slice(posPeak + tailOffset / 0.01)), // Maximum y-value from posPeak + tailOffset
      //       backgroundColor: 'rgba(0, 0, 255, 0.1)', // Light blue
      //       borderColor: 'blue',
      //       borderWidth: 1,
      //       label: {
      //         display: true, // Enable the label
      //         content: 'Selected Tail', // Text to display
      //         position: 'center', // Position the label in the center of the box
      //         color: 'black', // Text color
      //         backgroundColor: 'rgba(255, 255, 255, 0.8)', // Background color for the label
      //         font: {
      //           size: 14, // Font size
      //           weight: 'bold', // Font weight
      //         },
      //       },
      //     },
      //   },
      // },
    },
    // Add a zooming option
    zoom: {
      pan: {
        enabled: true, // Enable panning
        mode: 'xy', // Allow panning in both directions
      },
      zoom: {
        wheel: {
          enabled: true, // Enable zooming with the mouse wheel
        },
        drag: {
          enabled: true, // Enable zooming by dragging
          backgroundColor: 'rgba(0, 0, 0, 0.1)', // Background color of the drag rectangle
        },
        mode: 'xy', // Allow zooming in both directions
      },
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
    integralOfTail: 0,
    maxDeviation: 0,
    // responseClass: 'Unknown',
  });

  // Reset the canvas
  const resetCanvas = () => {
    setParams([5, 75000, 2.2, 0.1, 0.1, 0.03, 0.03]); // Reset parameters to default
    // setOverlayData([]); // Clear overlays
    setTailOffset(6); // Reset tail offset to default
    // setSelectedOverlayIndex(null); // Deselect any overlays
    setDataId('');
    setResponseMetrics({
      integralOfTail: 0,
      maxDeviation: 0,
      // responseClass: 'Unknown',
    }); // Reset response metrics
  };

  // useEffect functions
  useEffect(() => {
    const x = generateX();
    const y = x.map(val => response(val, params));
    const yIdeal = x.map(val => responseLegacy(val, params)); // Calculate the ideal response
    setDataPoints({ x, y, yIdeal });

    // // Calculate metrics
    // const metrics = calculateMetrics(params);
    // setResponseMetrics(metrics);

    // Find the peak in the ideal response
    const pos_peak = yIdeal.indexOf(Math.max(...yIdeal));
    setPosPeak(pos_peak); // Store pos_peak in state
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
          

          {/* */}
          <div style={{ marginTop: '20px' }}>
            <label style={{ marginRight: '10px', fontWeight: 'bold', color: '#495057' }}>
              Enter channel number:
            </label>
            <input
              type="text"
              value={dataId}
              onChange={(e) => setDataId(e.target.value)}
              style={{
                padding: '5px',
                border: '1px solid #ced4da',
                borderRadius: '5px',
                marginRight: '10px',
              }}
            />
            <button
              onClick={() => fetchDataById(dataId)}
              style={{
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Show
            </button>
            <button
              onClick={resetCanvas}
              style={{
                backgroundColor: '#dc3545',
                color: '#fff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Reset Canvas
            </button>
          </div>
          {/** */}

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
