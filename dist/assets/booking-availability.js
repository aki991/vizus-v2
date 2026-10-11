/* Izvor termina bez DOM-a. Demo se može zameniti adapterom sa istim ugovorom:
   getRange() -> { start: Date, end: Date }
   getSlots({ date: Date, service: string, doctor: string }) -> [{ time, available }]
   Za asinhroni API adapter prvo učitava/pamti raspored; UI ne generiše termine. */
(function (root) {
  'use strict';
  function createDemo(options) {
    var clock = options.clock || function () { return new Date(); };
    var start = new Date(clock()); start.setHours(0, 0, 0, 0);
    var end = new Date(start); end.setDate(end.getDate() + 60);
    var interval = Math.max(5, +options.interval || 30);
    var hours = options.hours || [];
    function minutes(value) { var parts = value.split(':'); return +parts[0] * 60 + +parts[1]; }
    function busy(date, time) {
      var key = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + time, hash = 0;
      for (var i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
      return hash % 100 < 30;
    }
    return {
      mode: 'demo',
      getRange: function () { return { start: new Date(start), end: new Date(end) }; },
      getSlots: function (query) {
        var date = query.date, rule = hours.filter(function (r) { return r.dani.indexOf(date.getDay()) !== -1; })[0];
        if (!rule || date < start || date > end) return [];
        var now = clock(), today = new Date(now); today.setHours(0, 0, 0, 0);
        var cutoff = +date === +today ? now.getHours() * 60 + now.getMinutes() + 60 : -1, slots = [];
        // Demo nema medicinsku relaciju ni raspored po lekaru/usluzi. Query je
        // prosleđen adapteru kako bi pravi izvor kasnije mogao da ih uzme u obzir.
        for (var t = minutes(rule.od); t + interval <= minutes(rule.do); t += interval) {
          var time = String(Math.floor(t / 60)).padStart(2, '0') + ':' + String(t % 60).padStart(2, '0');
          slots.push({ time: time, available: t > cutoff && !busy(date, time) });
        }
        return slots;
      }
    };
  }
  root.AureaBookingAvailability = { createDemo: createDemo };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.AureaBookingAvailability;
})(typeof window !== 'undefined' ? window : globalThis);
