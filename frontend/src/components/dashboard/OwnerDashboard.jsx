import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Alert } from '../ui/alert';
import {
  MapPin,
  Users,
  Radio,
  CreditCard,
  RefreshCw,
  LogOut,
  Layers,
  CheckCircle,
  Plus,
  X,
} from 'lucide-react';

export function OwnerDashboard({ user, onLogout, setView }) {
  const [estates, setEstates] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loadingEstates, setLoadingEstates] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Register Estate Form State
  const [showEstateForm, setShowEstateForm] = useState(false);
  const [submittingEstate, setSubmittingEstate] = useState(false);
  const [estateForm, setEstateForm] = useState({
    name: '',
    code: '',
    cropId: '',
    latitude: '6.9271',
    longitude: '79.8612',
  });

  const getAuthToken = () => {
    try {
      const auth = JSON.parse(localStorage.getItem('estate360_auth') || '{}');
      return auth.accessToken || '';
    } catch {
      return '';
    }
  };

  const loadData = async () => {
    setLoadingEstates(true);
    setErrorMsg('');
    const token = getAuthToken();
    if (!token) {
      setLoadingEstates(false);
      return;
    }

    try {
      // 1. Fetch Estates
      const estRes = await fetch('http://localhost:3000/estates', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (estRes.ok) {
        const estData = await estRes.json();
        setEstates(Array.isArray(estData) ? estData : []);
      }

      // 2. Fetch Crops
      const cropRes = await fetch('http://localhost:3000/crops', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (cropRes.ok) {
        const cropData = await cropRes.json();
        setCrops(Array.isArray(cropData) ? cropData : []);
        if (cropData.length > 0 && !estateForm.cropId) {
          setEstateForm((prev) => ({ ...prev, cropId: cropData[0].id }));
        }
      }
    } catch {
      setErrorMsg('Could not fetch real-time records from core-api.');
    } finally {
      setLoadingEstates(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function initialFetch() {
      const token = getAuthToken();
      if (!token) return;

      try {
        const [estRes, cropRes] = await Promise.all([
          fetch('http://localhost:3000/estates', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('http://localhost:3000/crops', { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        if (isMounted) {
          if (estRes.ok) {
            const data = await estRes.json();
            setEstates(Array.isArray(data) ? data : []);
          }
          if (cropRes.ok) {
            const cropData = await cropRes.json();
            setCrops(Array.isArray(cropData) ? cropData : []);
            if (cropData.length > 0) {
              setEstateForm((prev) => ({ ...prev, cropId: cropData[0].id }));
            }
          }
        }
      } catch {
        if (isMounted) {
          setErrorMsg('Could not connect to backend service.');
        }
      }
    }

    initialFetch();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCreateEstate = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!estateForm.name.trim() || !estateForm.code.trim()) {
      setErrorMsg('Estate Name and Code are required.');
      return;
    }

    const token = getAuthToken();
    if (!token) {
      setErrorMsg('No active session. Please log in again.');
      return;
    }

    const lat = parseFloat(estateForm.latitude) || 6.9271;
    const lon = parseFloat(estateForm.longitude) || 79.8612;
    const ownerId = user?.owner?.id || user?.id;

    // Small square polygon around the central coordinate
    const delta = 0.005;
    const polygon = [
      [
        [lon - delta, lat - delta],
        [lon + delta, lat - delta],
        [lon + delta, lat + delta],
        [lon - delta, lat + delta],
        [lon - delta, lat - delta],
      ],
    ];

    const payload = {
      name: estateForm.name.trim(),
      code: estateForm.code.trim().toUpperCase(),
      ownerId: ownerId,
      cropId: estateForm.cropId || (crops.length > 0 ? crops[0].id : undefined),
      location: {
        type: 'Point',
        coordinates: [lon, lat],
      },
      boundary: {
        type: 'Polygon',
        coordinates: polygon,
      },
      status: 'ACTIVE',
    };

    setSubmittingEstate(true);

    try {
      const res = await fetch('http://localhost:3000/estates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          Array.isArray(data.message) ? data.message.join(', ') : data.message || 'Failed to register estate.',
        );
      }

      setSuccessMsg(`Estate "${payload.name}" successfully registered!`);
      setShowEstateForm(false);
      setEstateForm({
        name: '',
        code: '',
        cropId: crops.length > 0 ? crops[0].id : '',
        latitude: '6.9271',
        longitude: '79.8612',
      });
      loadData();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSubmittingEstate(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F8F9FA] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Top Header */}
        <div className="bg-white border border-[#D7E6DD] p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="yellow" className="text-xs">
                OWNER SESSION
              </Badge>
              <Badge variant="light" className="text-xs text-[#1F3D2C]">
                Estate 360
              </Badge>
            </div>
            <h1 className="text-2xl font-bold text-[#1F3D2C]">
              Welcome, {user?.name || user?.email || 'Estate Owner'}
            </h1>
            <p className="text-xs text-[#4B5563]">
              Email: {user?.email} • Database: estate360-ai
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              onClick={() => setShowEstateForm(!showEstateForm)}
              className="bg-[#1F3D2C] text-white hover:bg-[#162D20] gap-1.5"
            >
              {showEstateForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              {showEstateForm ? 'Cancel Registration' : 'Register New Estate'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={loadData}
              disabled={loadingEstates}
              className="gap-1.5 border-[#1F3D2C] text-[#1F3D2C]"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingEstates ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setView('landing')}
              className="gap-1.5"
            >
              <Layers className="w-3.5 h-3.5" />
              Overview
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onLogout}
              className="text-[#8C6239] hover:bg-[#D7E6DD]/40 gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </Button>
          </div>
        </div>

        {errorMsg && (
          <Alert variant="error" title="Notice">
            {errorMsg}
          </Alert>
        )}

        {successMsg && (
          <Alert variant="success" title="Success">
            {successMsg}
          </Alert>
        )}

        {/* Register Estate Form (Accordion / Collapsible Box) */}
        {showEstateForm && (
          <Card className="border-2 border-[#1F3D2C] bg-white">
            <CardHeader className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base text-[#1F3D2C]">
                    Register Estate Under Your Owner Account
                  </CardTitle>
                  <CardDescription className="text-xs text-[#4B5563]">
                    Configure name, code, crop association, and GPS coordinates.
                  </CardDescription>
                </div>
                <Badge variant="light" className="text-xs text-[#1F3D2C]">
                  PostGIS Spatial
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <form onSubmit={handleCreateEstate} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="estateName" className="text-xs">
                      Estate Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="estateName"
                      placeholder="e.g. Green Valley Tea Estate"
                      value={estateForm.name}
                      onChange={(e) => setEstateForm({ ...estateForm, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="estateCode" className="text-xs">
                      Estate Code <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="estateCode"
                      placeholder="e.g. GV-01"
                      value={estateForm.code}
                      onChange={(e) => setEstateForm({ ...estateForm, code: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="cropSelect" className="text-xs">
                      Cultivated Crop
                    </Label>
                    <select
                      id="cropSelect"
                      value={estateForm.cropId}
                      onChange={(e) => setEstateForm({ ...estateForm, cropId: e.target.value })}
                      className="w-full h-10 px-3 py-2 border border-[#D1D5DB] bg-white text-sm text-[#1F2937] focus:outline-none focus:border-[#1F3D2C] focus:ring-1 focus:ring-[#1F3D2C]"
                    >
                      {crops.length > 0 ? (
                        crops.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} ({c.code})
                          </option>
                        ))
                      ) : (
                        <option value="">Default Commercial Crop</option>
                      )}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="latitude" className="text-xs">
                      Latitude
                    </Label>
                    <Input
                      id="latitude"
                      value={estateForm.latitude}
                      onChange={(e) => setEstateForm({ ...estateForm, latitude: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="longitude" className="text-xs">
                      Longitude
                    </Label>
                    <Input
                      id="longitude"
                      value={estateForm.longitude}
                      onChange={(e) => setEstateForm({ ...estateForm, longitude: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Button
                    type="submit"
                    disabled={submittingEstate}
                    className="bg-[#1F3D2C] text-white hover:bg-[#162D20] text-sm"
                  >
                    {submittingEstate ? 'Saving Estate...' : 'Save Estate'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowEstateForm(false)}
                    className="border-[#D1D5DB] text-[#4B5563]"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* 4 Flat Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border border-[#D7E6DD] bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between text-xs text-[#4B5563]">
                <span>Registered Estates</span>
                <MapPin className="w-4 h-4 text-[#8C6239]" />
              </div>
              <div className="mt-2 text-2xl font-bold text-[#1F3D2C]">
                {estates.length}
              </div>
              <div className="mt-1 text-[11px] text-[#8C6239] font-medium flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-[#1F3D2C]" />
                PostGIS Polygons
              </div>
            </CardContent>
          </Card>

          <Card className="border border-[#D7E6DD] bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between text-xs text-[#4B5563]">
                <span>Workforce Crew</span>
                <Users className="w-4 h-4 text-[#8C6239]" />
              </div>
              <div className="mt-2 text-2xl font-bold text-[#1F3D2C]">
                Active
              </div>
              <div className="mt-1 text-[11px] text-[#8C6239] font-medium">
                Supervisors & Pluckers
              </div>
            </CardContent>
          </Card>

          <Card className="border border-[#D7E6DD] bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between text-xs text-[#4B5563]">
                <span>LoRa IoT Badges</span>
                <Radio className="w-4 h-4 text-[#8C6239]" />
              </div>
              <div className="mt-2 text-2xl font-bold text-[#1F3D2C]">
                Tracking
              </div>
              <div className="mt-1 text-[11px] text-[#8C6239] font-medium">
                ESP32 Hardware Ingest
              </div>
            </CardContent>
          </Card>

          <Card className="border border-[#D7E6DD] bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between text-xs text-[#4B5563]">
                <span>Payroll Runs</span>
                <CreditCard className="w-4 h-4 text-[#8C6239]" />
              </div>
              <div className="mt-2 text-2xl font-bold text-[#1F3D2C]">
                Ready
              </div>
              <div className="mt-1 text-[11px] text-[#8C6239] font-medium">
                Piece-Rate Calculation
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Registered Estates List */}
        <Card className="border border-[#D7E6DD] bg-white">
          <CardHeader className="flex flex-row items-center justify-between py-4">
            <div>
              <CardTitle className="text-base text-[#1F3D2C]">
                Your Registered Estates
              </CardTitle>
              <CardDescription className="text-xs text-[#4B5563]">
                Estates linked to your owner account in PostgreSQL.
              </CardDescription>
            </div>
            <Button
              size="sm"
              onClick={() => setShowEstateForm(true)}
              className="bg-[#1F3D2C] text-white hover:bg-[#162D20] text-xs gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Register Estate
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {estates.length === 0 ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-10 h-10 bg-[#D7E6DD]/50 text-[#1F3D2C] flex items-center justify-center mx-auto">
                  <MapPin className="w-5 h-5 text-[#8C6239]" />
                </div>
                <div className="text-sm font-semibold text-[#1F3D2C]">
                  No estates registered yet
                </div>
                <p className="text-xs text-[#4B5563] max-w-sm mx-auto">
                  Click the <strong>Register Estate</strong> button above to add your first estate land plot and assign crops.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#D7E6DD]">
                {estates.map((est) => (
                  <div
                    key={est.id}
                    className="p-4 flex items-center justify-between hover:bg-[#F8F9FA] transition-colors"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-[#1F3D2C]">
                          {est.name}
                        </span>
                        <Badge variant="yellow" className="text-[10px] px-1.5 py-0">
                          {est.code}
                        </Badge>
                      </div>
                      <p className="text-xs text-[#4B5563]">
                        Crop: {est.crop?.name || 'Assigned'} • Status: {est.status || 'ACTIVE'}
                      </p>
                    </div>
                    <Badge variant="light" className="text-xs text-[#1F3D2C]">
                      PostGIS Cadastre
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
