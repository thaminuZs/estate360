import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
  createIotDevice,
  updateCloudConfig,
  triggerCloudSync,
} from '../../api/admin';
import { useAdmin } from '../../context/AdminContext';
import { Cpu, RefreshCw, Plus } from 'lucide-react';

export function AdminIotPage() {
  const {
    token,
    iotDevices,
    cloudConfig,
    setCloudConfig,
    setFeedbackMsg,
    reloadIotDevices,
  } = useAdmin();

  const [showAddDevice, setShowAddDevice] = useState(false);
  const [newDevCode, setNewDevCode] = useState('');
  const [newDevType, setNewDevType] = useState('worker_tracker');
  const [syncingCloud, setSyncingCloud] = useState(false);

  const handleCreateDevice = async (e) => {
    e.preventDefault();
    if (!newDevCode.trim()) {
      setFeedbackMsg({ type: 'error', text: 'Device code is required.' });
      return;
    }

    try {
      await createIotDevice(token, {
        deviceCode: newDevCode.trim().toUpperCase(),
        deviceType: newDevType,
        status: 'active',
      });

      setFeedbackMsg({
        type: 'success',
        text: `Device ${newDevCode} registered successfully.`,
      });
      setNewDevCode('');
      setShowAddDevice(false);
      await reloadIotDevices();
    } catch (err) {
      setFeedbackMsg({
        type: 'error',
        text: err.message || 'Failed to register device.',
      });
    }
  };

  const handleTriggerCloudSync = async () => {
    setSyncingCloud(true);
    setFeedbackMsg({ type: '', text: '' });
    try {
      const res = await triggerCloudSync(token, { limit: 100 });
      const workerCount = res.workerReadings?.syncedCount ?? res.workerReadings?.saved ?? 0;
      const envCount = res.environmentReadings?.syncedCount ?? res.environmentReadings?.saved ?? 0;
      setFeedbackMsg({
        type: 'success',
        text: `Sync completed! Saved ${workerCount} worker readings and ${envCount} environment readings.`,
      });
    } catch (err) {
      setFeedbackMsg({
        type: 'error',
        text: err.message || 'Failed to sync data from cloud.',
      });
    } finally {
      setSyncingCloud(false);
    }
  };

  const handleToggleCloudConfig = async () => {
    if (!cloudConfig) return;
    try {
      const updated = await updateCloudConfig(token, {
        enabled: !cloudConfig.enabled,
      });
      setCloudConfig(updated);
      setFeedbackMsg({
        type: 'success',
        text: `Cloud sync is now ${updated.enabled ? 'enabled' : 'disabled'}.`,
      });
    } catch (err) {
      setFeedbackMsg({
        type: 'error',
        text: err.message || 'Failed to update cloud configuration.',
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Cloud Sync Config Card */}
      <Card className="rounded-none border border-[#D7E6DD] bg-white shadow-xs">
        <CardHeader className="p-4 border-b border-[#D7E6DD]/60 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base text-[#1F3D2C] flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#1F3D2C]" />
              <span>IoT Telemetry Sync</span>
            </CardTitle>
            <CardDescription className="text-xs text-[#4B5563]">
              Synchronize readings from field gateways and wearable badges.
            </CardDescription>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              onClick={handleTriggerCloudSync}
              disabled={syncingCloud}
              className="rounded-none bg-[#1F3D2C] hover:bg-[#162D20] text-white text-xs h-8 px-4 cursor-pointer gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncingCloud ? 'animate-spin' : ''}`} />
              {syncingCloud ? 'Syncing...' : 'Sync Now'}
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={handleToggleCloudConfig}
              className="rounded-none border-[#D7E6DD] text-[#1F3D2C] hover:bg-[#D7E6DD]/30 h-8 text-xs cursor-pointer"
            >
              {cloudConfig?.enabled ? 'Disable Auto-Sync' : 'Enable Auto-Sync'}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-[#F8F9FA] border border-[#D7E6DD] p-3">
            <span className="text-[#4B5563] text-[11px] font-medium">CLOUD ENDPOINT</span>
            <p className="text-[#1F2937] font-semibold truncate mt-1">
              {cloudConfig?.apiUrl || 'http://localhost:3000/api/mock-cloud'}
            </p>
          </div>

          <div className="bg-[#F8F9FA] border border-[#D7E6DD] p-3">
            <span className="text-[#4B5563] text-[11px] font-medium">SYNC STATUS</span>
            <p className="mt-1">
              <span
                className={`inline-block px-2 py-0.5 text-xs font-semibold ${
                  cloudConfig?.enabled
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {cloudConfig?.enabled ? 'Active' : 'Standby / Manual'}
              </span>
            </p>
          </div>

          <div className="bg-[#F8F9FA] border border-[#D7E6DD] p-3">
            <span className="text-[#4B5563] text-[11px] font-medium">REGISTERED HARDWARE</span>
            <p className="text-[#1F3D2C] font-bold text-sm mt-1">
              {iotDevices.length} Devices
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Registered Devices List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#1F3D2C]">
              Registered IoT Devices
            </h3>
            <p className="text-xs text-[#4B5563]">
              Worker wearable beacons, GPS trackers, and soil stations.
            </p>
          </div>

          <Button
            size="sm"
            onClick={() => setShowAddDevice(!showAddDevice)}
            className="rounded-none bg-[#1F3D2C] hover:bg-[#162D20] text-white h-8 text-xs cursor-pointer gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            {showAddDevice ? 'Cancel' : 'Add Device'}
          </Button>
        </div>

        {showAddDevice && (
          <Card className="rounded-none border border-[#D7E6DD] bg-white p-4 shadow-xs">
            <form onSubmit={handleCreateDevice} className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <Label className="text-xs font-medium text-[#1F2937]">
                  Device Code *
                </Label>
                <Input
                  type="text"
                  placeholder="e.g. BEACON-01"
                  value={newDevCode}
                  onChange={(e) => setNewDevCode(e.target.value)}
                  required
                  className="rounded-none border-[#D7E6DD] text-xs h-8 uppercase"
                />
              </div>

              <div>
                <Label className="text-xs font-medium text-[#1F2937]">
                  Device Type
                </Label>
                <select
                  value={newDevType}
                  onChange={(e) => setNewDevType(e.target.value)}
                  className="w-full rounded-none border border-[#D7E6DD] text-xs h-8 px-2 bg-white text-[#1F2937]"
                >
                  <option value="worker_tracker">Worker Tracker (Wearable)</option>
                  <option value="environmental_sensor">Environmental Sensor</option>
                  <option value="weight_scale">Weight Scale</option>
                  <option value="base_station">Base Station</option>
                  <option value="gps_tag">GPS Tag</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button
                  type="submit"
                  size="sm"
                  className="w-full rounded-none bg-[#1F3D2C] hover:bg-[#162D20] text-white text-xs h-8 cursor-pointer"
                >
                  Register Device
                </Button>
              </div>
            </form>
          </Card>
        )}

        <div className="border border-[#D7E6DD] bg-white overflow-x-auto shadow-xs">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#D7E6DD] bg-[#F8F9FA] text-[#1F3D2C] font-semibold">
                <th className="p-3">Device Code</th>
                <th className="p-3">Hardware Type</th>
                <th className="p-3">Status</th>
                <th className="p-3">Added Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D7E6DD]/60">
              {iotDevices.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-6 text-center text-[#4B5563]">
                    No devices registered yet.
                  </td>
                </tr>
              ) : (
                iotDevices.map((dev) => (
                  <tr key={dev.id} className="hover:bg-[#F8F9FA]">
                    <td className="p-3 font-semibold text-[#1F3D2C] flex items-center gap-2">
                      <Cpu className="w-3.5 h-3.5 text-[#8C6239]" />
                      <span>{dev.deviceCode}</span>
                    </td>
                    <td className="p-3 text-[#4B5563]">{dev.deviceType}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 capitalize">
                        {dev.status || 'active'}
                      </span>
                    </td>
                    <td className="p-3 text-[#4B5563]">
                      {dev.createdAt ? new Date(dev.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
