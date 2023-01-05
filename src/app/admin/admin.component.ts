import { Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import {
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight,
} from '@fortawesome/free-solid-svg-icons';
import { DataService } from '../data.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  page: any;
  start = 0;
  end = 9;
  first = faAnglesLeft;
  prev = faAngleLeft;
  next = faAngleRight;
  last = faAnglesRight;
  edit = faPenToSquare;
  delete = faTrashCan;
  display_members!: any[];
  members: any[] = [];
  is_first_page = true;
  is_last_page = false;
  len = 0;
  page_number = 0;
  active!: Promise<boolean>;
  pages!: number[];

  constructor(private elem: ElementRef, private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getMembers().subscribe((response) => {
      this.members = response;
      this.members.forEach((member) => {
        member.isSelected = false;
      });
      this.len = this.members.length;
      this.display_members = this.members.slice(this.start, this.end + 1);
      this.active = Promise.resolve(true);
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      (
        this.elem.nativeElement.querySelectorAll('.page-number')[
          this.page_number
        ] as HTMLButtonElement
      ).classList.add('active');
    }, 500);
  }

  firstPage($event: Event) {
    this.start = 0;
    this.end = 9;
    this.is_first_page = true;
    this.is_last_page = false;
    this.display_members = this.members.slice(this.start, this.end + 1);
    this.page_number = 0;
    if (
      !($event.currentTarget as HTMLButtonElement).parentElement
        ?.getElementsByClassName('page-number')[0]
        .classList.contains('active')
    ) {
      this.page
        .toArray()[0]
        .nativeElement.querySelectorAll('.page-number')
        .forEach((element: any) => {
          element.classList.remove('active');
        });

      ($event.currentTarget as HTMLButtonElement).parentElement
        ?.getElementsByClassName('page-number')[0]
        .classList.add('active');
    }
  }

  lastPage($event: Event) {
    this.start =
      this.members.length % 10 === 0
        ? this.members.length - 10
        : this.members.length - (this.members.length % 10);
    this.end = this.members.length + 10 - (this.members.length % 10) - 1;
    this.is_first_page = false;
    this.is_last_page = true;
    this.display_members = this.members.slice(this.start, this.end + 1);
    let elem = (
      $event.currentTarget as HTMLButtonElement
    ).parentElement?.getElementsByClassName('page-number');
    let len = (
      $event.currentTarget as HTMLButtonElement
    ).parentElement?.getElementsByClassName('page-number').length;
    this.page_number = Math.round(this.members.length % 10) - 1;
    if (
      len &&
      !($event.currentTarget as HTMLButtonElement).parentElement
        ?.getElementsByClassName('page-number')
        [len - 1].classList.contains('active')
    ) {
      for (let i = 0; i < len; i++) {
        elem && elem[i].classList.remove('active');
      }
      ($event.currentTarget as HTMLButtonElement).parentElement
        ?.getElementsByClassName('page-number')
        [len - 1].classList.add('active');
    }
  }

  prevPage($event: Event) {
    this.start -= 10;
    this.end -= 10;
    this.display_members = this.members.slice(this.start, this.end + 1);
    this.page_number -= 1;
    if (
      !this.page
        .toArray()[0]
        .nativeElement.querySelectorAll('.page-number')
        [this.page_number].classList.contains('active')
    ) {
      this.page
        .toArray()[0]
        .nativeElement.querySelectorAll('.page-number')
        .forEach((element: any) => {
          element.classList.remove('active');
        });

      this.page
        .toArray()[0]
        .nativeElement.querySelectorAll('.page-number')
        [this.page_number].classList.add('active');
    }
    if (this.start === 0) {
      this.is_last_page = false;
      this.is_first_page = true;
    } else {
      this.is_last_page = false;
      (
        $event.currentTarget as HTMLButtonElement
      ).parentElement?.getElementsByClassName('page-number')[this.page_number];
    }
  }

  nextPage($event: Event) {
    this.start = this.end + 1;
    this.end += 10;
    this.display_members = this.members.slice(this.start, this.end + 1);
    this.page_number++;
    if (
      !this.page
        .toArray()[0]
        .nativeElement.querySelectorAll('.page-number')
        [this.page_number].classList.contains('active')
    ) {
      this.page
        .toArray()[0]
        .nativeElement.querySelectorAll('.page-number')
        .forEach((element: any) => {
          element.classList.remove('active');
        });

      this.page
        .toArray()[0]
        .nativeElement.querySelectorAll('.page-number')
        [this.page_number].classList.add('active');
    }
    if (this.end >= this.members.length - 1) {
      this.is_last_page = true;
      this.is_first_page = false;
    } else {
      this.is_first_page = false;
      (
        $event.currentTarget as HTMLButtonElement
      ).parentElement?.getElementsByClassName('page-number')[this.page_number];
    }
  }

  activePage($event: Event, page_number: number) {
    let currentNode = $event.target as HTMLButtonElement;
    this.page_number = page_number;
    this.start = (page_number + 1) * 10 - 10;
    this.end = (page_number + 1) * 10 - 1;
    this.display_members = this.members.slice(this.start, this.end + 1);
    if (!currentNode.classList.contains('active')) {
      this.is_first_page = page_number === 0;
      this.is_last_page = page_number === this.pages.length - 1;

      this.elem.nativeElement
        .querySelectorAll('.page-number')
        .forEach((element: any) => {
          (element as HTMLButtonElement).classList.remove('active');
        });
      currentNode.classList.add('active');
    }
  }

  editMember(index: number) {
    this.elem.nativeElement
      .querySelectorAll('tbody tr')
      [index].querySelectorAll('td input')
      .forEach((element: any) => {
        if (element.type !== 'checkbox') {
          element.classList.remove('disabled-input');
          element.classList.add('edit-input');
          element.disabled = false;
        }
      });
  }

  deleteMember(index: number) {
    this.display_members.splice(index, 1);
  }

  saveChange(index: number, $event: KeyboardEvent) {
    let keyCode = $event.code;

    if (keyCode === 'Enter') {
      this.elem.nativeElement
        .querySelectorAll('tbody tr')
        [index].querySelectorAll('td input')
        .forEach((element: HTMLInputElement) => {
          if (element.type !== 'checkbox') {
            element.classList.remove('edit-input');
            element.classList.add('disabled-input');
            element.disabled = true;
          }
        });
    }
  }

  deleteSelected() {
    this.display_members = this.display_members.filter(
      (member) => !member.isSelected
    );
  }

  counter(i: number) {
    this.pages = new Array(Math.ceil(i));
    return this.pages;
  }

  select(index: number) {
    this.display_members[index].isSelected = true;
  }

  selectAll() {
    this.elem.nativeElement
      .querySelectorAll('tbody tr')
      .forEach((element: any) => {
        element.querySelector('td input').checked =
          !element.querySelector('td input').checked;
      });
    this.display_members.map((member) => {
      member.isSelected = !member.isSelected;
    });
  }
}
