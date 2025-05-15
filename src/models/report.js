const dbPool = require("../config/knex")

const reportModel = {
  getTotalMonthly: (yearmonth) => {
    const [year, month] = yearmonth.split("-")
    return dbPool("bookings")
      .count('* as total')
      .whereRaw('YEAR(start) = ?', [year])
      .andWhereRaw('MONTH(start) =  ?', [month])
  },

  getBookingByStatus: (yearmonth) => {
    const [year, month] = yearmonth.split("-");
    return dbPool("bookings")
      .select(dbPool.raw("COALESCE(status, 'On Schedule') as status"))
      .count('* as total')
      .whereRaw('YEAR(start) = ?', [year])
      .andWhereRaw('MONTH(start) =  ?', [month])
      .groupBy('status');
  },

  getTopUsers: (yearmonth) => {
    const [year, month] = yearmonth.split('-');
    return dbPool('bookings as b')
      .join('users as u', 'b.id_user', 'u.id_user')
      .select('u.username', 'u.dept')
      .count('b.id_booking as total_bookings')
      .select(dbPool.raw('SUM(TIMESTAMPDIFF(MINUTE, b.start, b.end)) as total_minutes'))
      .whereRaw('YEAR(b.start) = ?', [year])
      .andWhereRaw('MONTH(b.start) = ?', [month])
      .andWhere('b.status', 'Present')
      .groupBy('b.id_user')
      .orderBy('total_minutes', 'desc')
      .limit(3);
  },

  getTotalBookingsByDept: (yearmonth) => {
    const [year, month] = yearmonth.split('-');
    return dbPool('bookings as b')
      .join('users as u', 'b.id_user', 'u.id_user')
      .select('u.dept')
      .count('b.id_booking as total_bookings')
      .sum({ total_minutes: dbPool.raw('TIMESTAMPDIFF(MINUTE, b.start, b.end)') })
      .whereRaw('YEAR(b.start) = ?', [year])
      .andWhereRaw('MONTH(b.start) = ?', [month])
      .andWhere('b.status', 'Present')
      .groupBy('u.dept')
      .orderBy('total_bookings', 'desc');
  },

  getRoomUsageSummary: (yearmonth) => {
    const [year, month] = yearmonth.split('-');
    return dbPool('bookings as b')
      .join('rooms as r', 'b.id_room', 'r.id_room')
      .select('r.room_name')
      .count('b.id_booking as total_bookings')
      .select(dbPool.raw('SUM(TIMESTAMPDIFF(MINUTE, b.start, b.end)) as total_duration_minutes'))
      .where('b.status', 'Present')
      .andWhereRaw('YEAR(b.start) = ?', [year])
      .andWhereRaw('MONTH(b.start) = ?', [month])
      .groupBy('b.id_room')
      .orderBy('total_bookings', 'desc')
      .limit(5);
  }

}

module.exports = reportModel