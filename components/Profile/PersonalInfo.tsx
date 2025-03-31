import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PersonalInfoProps } from "@/types/types";

export const PersonalInfo = ({
    profileData,
    isEditing,
    onEdit,
    onSave,
    onCancel,
    onFieldChange,
  }: PersonalInfoProps) => (
  <Card className="mt-6">
    <CardContent className="p-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-6">Thông tin cá nhân</h2>
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center">
            <div>
              <Label className="font-medium">Ngày sinh</Label>
              {!isEditing.birthDate && (
                <p className="text-gray-600">{profileData.birthDate ? new Date(profileData.birthDate).toLocaleDateString('vi-VN') : "Chưa có thông tin"}</p>
              )}
            </div>
            {!isEditing.birthDate && (
              <Button variant="link" onClick={() => onEdit('birthDate')}>Thay đổi</Button>
            )}
          </div>
          {isEditing.birthDate && (
            <>
              <Input type="date" value={profileData.birthDate} onChange={(e) => onFieldChange('birthDate', e.target.value)} />
              <div className="mt-2 flex justify-end space-x-2">
                <Button onClick={() => onSave('birthDate')}>Lưu</Button>
                <Button variant="outline" onClick={() => onCancel('birthDate')}>Hủy</Button>
              </div>
            </>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center">
            <div>
              <Label className="font-medium">Giới tính</Label>
              {!isEditing.gender && (
                <p className="text-gray-600">{profileData.gender ? (profileData.gender === "MALE" ? "Nam" : profileData.gender === "FEMALE" ? "Nữ" : profileData.gender === "OTHER" ? "Khác" : "Không chia sẻ") : "Chưa có thông tin"}</p>
              )}
            </div>
            {!isEditing.gender && (
              <Button variant="link" onClick={() => onEdit('gender')}>Thay đổi</Button>
            )}
          </div>
          {isEditing.gender && (
            <>
              <Select onValueChange={(value) => onFieldChange('gender', value)} defaultValue={profileData.gender}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn giới tính" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Nam</SelectItem>
                  <SelectItem value="FEMALE">Nữ</SelectItem>
                  <SelectItem value="OTHER">Khác</SelectItem>
                  <SelectItem value="PRIVATE">Không chia sẻ</SelectItem>
                </SelectContent>
              </Select>
              <div className="mt-2 flex justify-end space-x-2">
                <Button onClick={() => onSave('gender')}>Lưu</Button>
                <Button variant="outline" onClick={() => onCancel('gender')}>Hủy</Button>
              </div>
            </>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center">
            <div>
              <Label className="font-medium">Số điện thoại</Label>
              {!isEditing.phone && (
                <p className="text-gray-600">{profileData.phone || "Chưa có thông tin"}</p>
              )}
            </div>
            {!isEditing.phone && (
              <Button variant="link" onClick={() => onEdit('phone')}>Thay đổi</Button>
            )}
          </div>
          {isEditing.phone && (
            <>
              <Input type="tel" value={profileData.phone} onChange={(e) => onFieldChange('phone', e.target.value)} placeholder="Nhập số điện thoại" />
              <div className="mt-2 flex justify-end space-x-2">
                <Button onClick={() => onSave('phone')}>Lưu</Button>
                <Button variant="outline" onClick={() => onCancel('phone')}>Hủy</Button>
              </div>
            </>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center">
            <div>
              <Label className="font-medium">Địa chỉ</Label>
              {!isEditing.address && (
                <p className="text-gray-600">{profileData.address || "Chưa có thông tin"}</p>
              )}
            </div>
            {!isEditing.address && (
              <Button variant="link" onClick={() => onEdit('address')}>Thay đổi</Button>
            )}
          </div>
          {isEditing.address && (
            <>
              <Textarea value={profileData.address} onChange={(e) => onFieldChange('address', e.target.value)} placeholder="Nhập địa chỉ" rows={3} />
              <div className="mt-2 flex justify-end space-x-2">
                <Button onClick={() => onSave('address')}>Lưu</Button>
                <Button variant="outline" onClick={() => onCancel('address')}>Hủy</Button>
              </div>
            </>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);