import type { CategoryContent } from './content-validation';

export const bundledContent: readonly CategoryContent[] = [
  { id: 'music', name: 'Âm nhạc', contentVersion: 1, challenges: [
    { id: 'music-1', categoryId: 'music', text: 'Ngân nga một bài hát để mọi người đoán tên.' },
    { id: 'music-2', categoryId: 'music', text: 'Kể tên ba nhạc cụ trong mười giây.' },
  ] },
  { id: 'travel', name: 'Du lịch', contentVersion: 1, challenges: [
    { id: 'travel-1', categoryId: 'travel', text: 'Kể về chuyến đi trong mơ của bạn bằng một câu.' },
    { id: 'travel-2', categoryId: 'travel', text: 'Kể tên ba món đồ cần mang theo cho chuyến đi cuối tuần.' },
  ] },
  { id: 'technology', name: 'Công nghệ', contentVersion: 1, challenges: [
    { id: 'technology-1', categoryId: 'technology', text: 'Kể tên ba thiết bị có màn hình.' },
    { id: 'technology-2', categoryId: 'technology', text: 'Mô tả một ứng dụng quen thuộc mà không nói tên.' },
  ] },
  { id: 'geography', name: 'Địa lý', contentVersion: 1, challenges: [
    { id: 'geography-1', categoryId: 'geography', text: 'Kể tên ba quốc gia ở châu Âu.' },
    { id: 'geography-2', categoryId: 'geography', text: 'Nêu tên một thủ đô để mọi người đoán quốc gia.' },
  ] },
  { id: 'economy', name: 'Kinh tế', contentVersion: 1, challenges: [
    { id: 'economy-1', categoryId: 'economy', text: 'Kể tên ba thứ mà mọi người thường tiết kiệm tiền để mua.' },
    { id: 'economy-2', categoryId: 'economy', text: 'Nêu một cách để so sánh giá của hai món hàng.' },
  ] },
  { id: 'films', name: 'Phim ảnh', contentVersion: 1, challenges: [
    { id: 'films-1', categoryId: 'films', text: 'Diễn tả một thể loại phim để mọi người đoán.' },
    { id: 'films-2', categoryId: 'films', text: 'Kể tên ba kiểu nhân vật thường gặp trong phim.' },
  ] },
  { id: 'healthcare', name: 'Chăm sóc sức khỏe', contentVersion: 1, challenges: [
    { id: 'healthcare-1', categoryId: 'healthcare', text: 'Kể tên ba thói quen hằng ngày giúp bạn khỏe mạnh.' },
    { id: 'healthcare-2', categoryId: 'healthcare', text: 'Kể tên ba nghề nghiệp giúp chăm sóc bệnh nhân trong bệnh viện.' },
  ] },
  { id: 'folklore', name: 'Truyện dân gian', contentVersion: 1, challenges: [
    { id: 'folklore-1', categoryId: 'folklore', text: 'Kể lại một truyện cổ tích quen thuộc trong ba câu.' },
    { id: 'folklore-2', categoryId: 'folklore', text: 'Tưởng tượng một sinh vật thần thoại thân thiện và đặt tên cho nó.' },
  ] },
];
