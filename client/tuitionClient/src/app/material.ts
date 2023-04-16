import { NgModule } from "@angular/core";
import { MatToolbarModule } from '@angular/material/toolbar' 
import { MatFormFieldModule } from '@angular/material/form-field' 
import { MatInputModule } from '@angular/material/input' 
import { MatIconModule } from '@angular/material/icon' 
import { MatDatepickerModule } from '@angular/material/datepicker' 
import { MatNativeDateModule } from '@angular/material/core' 
import { MatButtonModule } from '@angular/material/button' 
import {MatSelectModule} from '@angular/material/select';
import {MatListModule} from '@angular/material/list';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTableModule} from '@angular/material/table';
import {MatCardModule} from '@angular/material/card';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { MatDividerModule } from "@angular/material/divider";
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDialogModule} from '@angular/material/dialog'
import {MatSidenavModule} from '@angular/material/sidenav';

const matModules: any[] = [ MatFormFieldModule, MatInputModule, MatCardModule,
                            MatIconModule, MatDatepickerModule, MatNativeDateModule, 
                            MatButtonModule, MatSelectModule, MatSnackBarModule,
                            MatListModule, MatTabsModule, MatTableModule, 
                            MatDividerModule, MatTooltipModule, MatDialogModule,
                            MatSidenavModule]

@NgModule({ imports: matModules, exports: matModules})

export class MaterialModule { } 

