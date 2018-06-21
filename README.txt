
-- Version 47
# 1. เพิ่ม hook_node_update เพราะว่าต้องการเช็ดกรณีเราแก้ไขเฉพาะ application idna เพื่อทีจะ update data firebase ได้ถูก

-- Version 46
1. แก้ปัญหาการ load รูปทั้งระบบ
2. เพิ่มส่วน แสดงว่าไครเป้นคน post, comment ได้
3. หลังบ้านจะมีการตั้งให้รัน auto ทุก 30 นาที กรณีมี my application ใหม่ๆ เข้ามา
4. เพิ่มส่วน my application ให่สามารถ published / not published ได้ โดยเริ่มแรกเราสร้าง my application ขึ้นมา defualt จะเป็น not published โดยเจ้าของ application ต้องเป็นคน published เอง
5. ปรับหลังส่วนของกลุ่ม (Group)
6. Tab Recent ปรับกรณีที่ มีการลบ user หรือ group จะมีการเครียส์ออกให้อัติโนมัติ
7. ใส่ Voice & Video Call
8. Force Logout
9. Login, Logout, Sign up, Forgot password