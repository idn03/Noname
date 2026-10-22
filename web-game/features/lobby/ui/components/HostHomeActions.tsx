interface HostHomeActionsProps {
  connected: boolean;
  pending: boolean;
  error: string;
  onCreate: () => void;
}

export function HostHomeActions({ connected, pending, error, onCreate }: HostHomeActionsProps) {
  return <div className="home-action host-home-action">
    <section className="host-rule-overview" aria-labelledby="rules-heading">
      <h2 id="rules-heading">Luật chơi:</h2>
      <ul>
        <li>• Tất cả người chơi (ngoại trừ chủ phòng) sẽ được chia thành 2 đội: <strong>Cừu</strong> và <strong>Sói</strong></li>
        <li>• Mỗi đội sẽ chọn những thẻ bài và thực hiện các thử thách tương ứng để lấy điểm</li>
        <li>• Đội có số điểm lớn hơn ở cuối trận đấu sẽ là đội chiến thắng</li>
      </ul>
    </section>
    <section className="host-team-rule host-team-rule--sheep" aria-labelledby="sheep-rule-heading">
      <div className="host-team-heading"><img src="/assets/teams/sheep-icon.svg" alt="" /><h2 id="sheep-rule-heading">Đội Cừu:</h2></div>
      <p>Đoán các thẻ mà <strong className="!text-black">Đội Sói</strong> chọn để chọn những thẻ phòng thủ phù hợp. Khi đối phương tấn công, nếu Đội Cừu có các thẻ tương ứng sẽ cho phép lật và phòng thủ. Để phòng thủ thành công tuyệt đối, Cừu cần phải thực hiện thành công thử thách được mô tả trong thẻ.</p>
    </section>
    <section className="host-team-rule host-team-rule--wolf" aria-labelledby="wolf-rule-heading">
      <div className="host-team-heading"><img src="/assets/teams/wolf-icon.svg" alt="" /><h2 id="wolf-rule-heading" className="!text-black">Đội Sói:</h2></div>
      <p className="!text-black">Đội của bạn sẽ chọn các thẻ và thử thách mà trò chơi cung cấp. Khi bắt đầu lượt, lật 1 thẻ đã chọn để tấn công, lượt tấn công thành công là khi <strong>Đội Cừu</strong> không có thẻ cùng loại để phòng thủ hoặc không hoàn thành thử thách. Nếu tấn công thành công, đội của bạn sẽ được cộng điểm và bắt cóc một chú <strong>Cừu</strong>.</p>
    </section>
    <div className="host-create">
      <button type="button" disabled={!connected || pending} onClick={onCreate}>{pending ? 'ĐANG TẠO…' : 'TẠO'}</button>
      <p className="host-create-note">Tạo phòng trên máy chủ này và tham gia với tư cách Host.</p>
      {error && <p className="error-message" role="alert">{error}</p>}
    </div>
  </div>;
}
