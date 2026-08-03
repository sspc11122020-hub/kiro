const fs = require('fs');

const FILE_PATH = './sadeemtv.json';

async function checkAndUpdateDomain() {
  try {
    // 1. قراءة ملف JSON
    const rawData = fs.readFileSync(FILE_PATH, 'utf8');
    const data = JSON.parse(rawData);

    if (!Array.isArray(data) || !data[0] || !data[0].OrgWeb) {
      console.error('لم يتم العثور على حقل OrgWeb في الملف.');
      return;
    }

    const currentDomain = data[0].OrgWeb;
    console.log(`الدومين الحالي المسجل: ${currentDomain}`);

    // 2. إرسال طلب وتتبع التوجيه (Redirect)
    const response = await fetch(currentDomain, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    // استخراج الدومين الأساسي فقط من الرابط النهائي (بدون مسارات إضافية)
    const finalUrl = new URL(response.url);
    const newDomain = finalUrl.origin;

    console.log(`الدومين الفعلي الحالي: ${newDomain}`);

    // 3. التحديث في حال وجود تغيير
    if (newDomain && newDomain !== currentDomain) {
      console.log(`تم تغيير الدومين من [${currentDomain}] إلى [${newDomain}]`);
      data[0].OrgWeb = newDomain;

      fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
      console.log('تم تحديث ملف sadeemtv.json بنجاح.');
    } else {
      console.log('الدومين يعمل ولم يتغير.');
    }
  } catch (error) {
    console.error('حدث خطأ أثناء فحص الدومين:', error.message);
  }
}

checkAndUpdateDomain();
