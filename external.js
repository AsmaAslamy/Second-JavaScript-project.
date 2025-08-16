(function () {
    'use strict';

    // ---------- Helpers ----------
    function clean(v) {
      return (v === undefined || v === null) ? '' : String(v).trim();
    }
    function toNumber(v) {
      var n = parseInt(clean(v), 10);
      return isFinite(n) ? n : NaN;
    }
    function capitalize(s) {
      s = clean(s);
      return s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
    }
    function yes(v) {
      return /^y(es)?$/i.test(clean(v));
    }
    function normalizePotion(input, list) {
      var raw = clean(input).toLowerCase();
      var asNum = toNumber(raw);
      if (isFinite(asNum) && asNum >= 1 && asNum <= list.length) return list[asNum - 1];
      for (var i = 0; i < list.length; i++) {
        if (list[i].toLowerCase().indexOf(raw) === 0) return list[i];
      }
      return null;
    }

    // ---------- 1) Start ----------
    var playerName = clean(prompt('Welcome to the Magic Potion Shop!\n\nApprentice, what is your name?'));
    var age = toNumber(prompt('How old are you?'));
    while (!isFinite(age) || age < 0) {
      age = toNumber(prompt('Please enter a valid age (number):'));
    }

    var favoriteElement = clean(prompt('Choose your favorite element:\n- Fire\n- Water\n- Earth\n- Air')).toLowerCase();
    var allowed = ['fire','water','earth','air'];
    if (allowed.indexOf(favoriteElement) === -1) favoriteElement = 'fire';

    var elementMsg =
      favoriteElement === 'fire'  ? 'Your fiery spirit will forge strong brews!' :
      favoriteElement === 'water' ? 'Your calm waves bring clarity to every mixture.' :
      favoriteElement === 'earth' ? 'Steady as stone—your potions will be reliable.' :
                                    'Swift as the wind—your work will be efficient.';

    alert('Welcome ' + capitalize(playerName) + '! At ' + age +
          ", you're just the right age to master the powers of " + favoriteElement + '.\n' + elementMsg);

    // ---------- 2) Stock ----------
    var potions = ['Healing Potion','Mana Elixir','Invisibility Draft','Fire Resistance'];
    var potionStock = {
      'Healing Potion':     { quantity: 5, price: 10 },
      'Mana Elixir':        { quantity: 3, price: 15 },
      'Invisibility Draft': { quantity: 2, price: 25 },
      'Fire Resistance':    { quantity: 4, price: 20 }
    };

    var gold = 0;
    var customersHelped = 0;
    var brewedCount = 0;

    function menuString() {
      // از map اگر بود استفاده کن؛ در غیر این صورت دستی بساز
      if (Array.prototype.map) {
        return potions.map(function (p, i) {
          var item = potionStock[p];
          return (i + 1) + ') ' + p + ' — ' + item.price + 'g (left: ' + item.quantity + ')';
        }).join('\n');
      } else {
        var s = '';
        for (var i = 0; i < potions.length; i++) {
          var it = potionStock[potions[i]];
          s += (i + 1) + ') ' + potions[i] + ' — ' + it.price + 'g (left: ' + it.quantity + ')\n';
        }
        return s.replace(/\n$/, '');
      }
    }

    // ---------- 4) Brewing ----------
    function brewPotion(potionName, amount) {
      var name = normalizePotion(potionName, potions);
      var add = toNumber(amount);
      if (!name) { alert('Unknown potion name. Brewing canceled.'); return false; }
      if (!isFinite(add) || add <= 0) { alert('Invalid amount. Brewing canceled.'); return false; }
      potionStock[name].quantity += add;
      brewedCount += add;
      alert('Brewed ' + add + ' x ' + name + '. New stock: ' + potionStock[name].quantity);
      return true;
    }

// ShabirShahir, [8/16/2025 7:43 PM]
// ---------- 3) Customers (3 loops) ----------
    for (var c = 1; c <= 3; c++) {
      var someone = prompt('A customer is here! Take their order? (yes/no)\n(Customer ' + c + ' of 3)');
      if (!yes(someone)) { alert('You decided to skip this customer.'); continue; }

      alert("Here is today's potion menu:\n\n" + menuString());

      var choice = prompt('Which potion does the customer want?\n(Type name or number 1..4)');
      var selected = normalizePotion(choice, potions);
      if (!selected) { alert('We could not understand the order. The customer leaves confused.'); continue; }

      var item = potionStock[selected];

      switch (selected) {
        case 'Healing Potion':
        case 'Mana Elixir':
        case 'Invisibility Draft':
        case 'Fire Resistance':
          if (item.quantity > 0) {
            item.quantity -= 1;
            gold += item.price;
            customersHelped += 1;
            alert('Sold 1 x ' + selected + ' for ' + item.price + 'g. Remaining: ' + item.quantity + '. Gold: ' + gold + 'g');
          } else {
            alert('Sorry, ' + selected + ' is out of stock!');
          }
          break;
        default:
          alert('That potion is not available.');
      }
    }

    // ---------- Brew 2–3 times ----------
    var brewTurns = 0;
    while (brewTurns < 3) {
      var wantBrew = prompt('Do you want to brew more potions? (yes/no)');
      if (!yes(wantBrew)) break;
      var pName = prompt('Enter potion to brew (name or number 1..4):');
      var amt = prompt('How many to brew? (number)');
      brewPotion(pName, amt);
      brewTurns += 1;
    }

    // ---------- 5) End of Day Report ----------
    var stockReport = 'End of Day Stock:\n';
    for (var k in potionStock) {
      if (!Object.prototype.hasOwnProperty.call(potionStock, k)) continue;
      var q = potionStock[k].quantity;
      var pr = potionStock[k].price;
      stockReport += '- ' + k + ': ' + q + ' left (price: ' + pr + 'g)\n';
    }
    var finalLine = 'Great job, ' + capitalize(playerName) + '! You brewed ' + brewedCount +
                    ' potion' + (brewedCount === 1 ? '' : 's') + ' and helped ' + customersHelped +
                    ' customer' + (customersHelped === 1 ? '' : 's') + ' today!';

    alert(stockReport + '\nTotal gold earned: ' + gold + 'g\n\n' + finalLine);
  })();

