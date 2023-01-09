import moment from 'moment';

const getDateOrTime = ts => {
  const now = moment().startOf('day');
  const target = moment(ts).startOf('day');
  return moment(ts).format(now.diff(target, 'day') > 0 ? 'MM/DD' : 'HH:mm');
};

const TimeStamp = (createdAt)=>{
  return (getDateOrTime(createdAt));
};

export default TimeStamp;