// ShipmentCreate.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import { useApi } from "@/contexts/ApiProvider";
import AppLayout from "@/components/layout/AppLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import SelectV2 from "@/components/ui/select/select-v2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function ShipmentCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bill_of_lading_number_id: "",
    contains_dangerous_good: false,
    date_of_loading: "",
    note: "",
    status: 1, // Adding status field with default value 1 (Pending)
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(true);
  const api = useApi();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert status to number if it comes as string from form
    const payload = {
      ...formData,
      status: Number(formData.status),
    };

    const response = await api.post("/en/api/v1/shipment/create/", payload);

    if (response.body.error) {
      if (response.body.error.bill_of_lading_number_id) {
        setError(response.body.error.bill_of_lading_number_id[0]);
      }
    }

    if (response.ok) {
      navigate(`/shipments/${response.body.data.id}`);
      setLoading(false);
    }
  };

  return (
    <AppLayout classNames={{ container: "max-w-4xl" }}>
      <div className="mb-6 flex items-center justify-end">
        <Button variant="outline" onClick={() => navigate("/shipments")}>
          <ArrowLeft className="!ms-0 me-2" />
          Back to Shipments
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Shipment</CardTitle>
        </CardHeader>

        <CardContent>
          {error && <div className="mb-6 rounded-lg bg-red-500 p-4 text-white">Error: {error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <Label isRequired className="mb-2 block text-muted-foreground">
                  Bill of Lading Number
                </Label>
                <Input
                  type="text"
                  name="bill_of_lading_number_id"
                  value={formData.bill_of_lading_number_id}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label className="mb-2 block text-muted-foreground">Date of Loading</Label>
                <Input
                  type="datetime-local"
                  name="date_of_loading"
                  value={formData.date_of_loading}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex items-center">
                <Checkbox
                  id="contains_dangerous_good"
                  name="contains_dangerous_good"
                  checked={formData.contains_dangerous_good}
                  onCheckedChange={(value) =>
                    setFormData((prev) => ({ ...prev, contains_dangerous_good: Boolean(value) }))
                  }
                />
                <Label
                  htmlFor="contains_dangerous_good"
                  className="ml-2 block text-muted-foreground"
                >
                  Contains Dangerous Goods
                </Label>
              </div>

              <div>
                <Label isRequired className="mb-2 block text-muted-foreground">
                  Status
                </Label>
                <SelectV2
                  onValueChange={(v) => {
                    setFormData((prev) => ({ ...prev, status: Number(v) }));
                  }}
                  value={formData.status}
                  items={[
                    { value: 1, name: "pending" },
                    { value: 2, name: "In Progress" },
                    { value: 3, name: "Completed" },
                    { value: 4, name: "Cancelled" },
                  ]}
                />
              </div>

              <div className="md:col-span-2">
                <Label className="mb-2 block text-muted-foreground">Notes</Label>
                <Textarea name="note" value={formData.note} onChange={handleInputChange} rows={3} />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Shipment"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
