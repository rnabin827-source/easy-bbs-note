import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";

actor {
  type Year = {
    #y1;
    #y2;
    #y3;
  };

  module Note {
    public type Note = {
      id : Nat;
      title : Text;
      subject : Text;
      year : Year;
      content : Text;
    };

    public func compareById(note1 : Note, note2 : Note) : Order.Order {
      Nat.compare(note1.id, note2.id);
    };
  };

  public type Note = Note.Note;

  func yearCompare(year1 : Year, year2 : Year) : Bool {
    year1 == year2;
  };

  module Year {
    public func toText(year : Year) : Text {
      switch (year) {
        case (#y1) { "1st Year" };
        case (#y2) { "2nd Year" };
        case (#y3) { "3rd Year" };
      };
    };
  };

  var nextId = 0;
  let notes = Map.empty<Nat, Note>();
  public shared ({ caller }) func addNote(title : Text, subject : Text, year : Text, content : Text) : async Note {
    let parsedYear = switch (year) {
      case ("1st Year") { #y1 };
      case ("2nd Year") { #y2 };
      case ("3rd Year") { #y3 };
      case (_) { Runtime.trap("Invalid year") };
    };
    let id = nextId;
    nextId += 1;
    let note : Note = {
      id;
      title;
      subject;
      year = parsedYear;
      content;
    };
    notes.add(id, note);
    note;
  };

  public query ({ caller }) func getNotes(year : ?Text) : async [Note] {
    switch (year) {
      case (null) {
        notes.values().sort(Note.compareById).toArray();
      };
      case (?yearText) {
        let filtered = notes.values().filter(
          func(note) {
            Text.equal(Year.toText(note.year), yearText);
          }
        );
        filtered.sort(Note.compareById).toArray();
      };
    };
  };
};
